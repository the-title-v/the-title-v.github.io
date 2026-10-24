import { createHash } from 'node:crypto';
import { constants } from 'node:fs';
import { copyFile, lstat, mkdir, open, readFile, readdir, realpath, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';

export const AVAILABILITY_PROPERTIES = Object.freeze([
  'bright-1br-rawai-beach',
  'cozy-1br-rawai-beach',
  'two-adjacent-apartments-title-v-rawai',
]);

const onlyKeys = (value, keys) => value !== null && typeof value === 'object' && !Array.isArray(value)
  && [Object.prototype, null].includes(Object.getPrototypeOf(value))
  && Reflect.ownKeys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}

function union(ranges) {
  const merged = [];
  for (const range of ranges.toSorted((a, b) => a.start.localeCompare(b.start))) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) {
      if (range.end > previous.end) previous.end = range.end;
    } else merged.push({ ...range });
  }
  return merged;
}

/** Validate publication data without retaining or reporting any extra source fields. */
export function validateAvailabilitySnapshots(value, now = Date.now(), maxAgeMs = 15 * 60 * 1000) {
  try {
    if (!Number.isFinite(now) || !Number.isFinite(maxAgeMs) || maxAgeMs <= 0
        || !onlyKeys(value, AVAILABILITY_PROPERTIES)) throw new Error();
    const snapshots = Object.fromEntries(AVAILABILITY_PROPERTIES.map(property => {
      const item = value[property];
      if (!onlyKeys(item, ['status', 'blocked', 'checkedAt']) || item.status !== 'snapshot'
          || !Array.isArray(item.blocked) || typeof item.checkedAt !== 'string') throw new Error();
      const time = Date.parse(item.checkedAt);
      if (!Number.isFinite(time) || new Date(time).toISOString() !== item.checkedAt
          || now - time < 0 || now - time >= maxAgeMs) throw new Error();
      let previousEnd = '';
      const blocked = item.blocked.map(range => {
        if (!onlyKeys(range, ['start', 'end']) || !validDate(range.start) || !validDate(range.end)
            || range.end <= range.start || range.start <= previousEnd) throw new Error();
        previousEnd = range.end;
        return { start: range.start, end: range.end };
      });
      return [property, { status: 'snapshot', blocked, checkedAt: item.checkedAt }];
    }));
    const [first, second, combined] = AVAILABILITY_PROPERTIES.map(property => snapshots[property]);
    const oldestCheck = Date.parse(first.checkedAt) <= Date.parse(second.checkedAt) ? first.checkedAt : second.checkedAt;
    if (combined.checkedAt !== oldestCheck
        || JSON.stringify(combined.blocked) !== JSON.stringify(union([...first.blocked, ...second.blocked]))) throw new Error();
    return snapshots;
  } catch {
    throw new Error('Invalid availability snapshot.');
  }
}

const privateNames = new Set(['.git', '.hg', '.svn', 'node_modules', 'server', 'private', 'config', '.aws', '.ssh', '.wrangler', '.config', '.npmrc', '.netrc', '.envrc', '.htpasswd']);
const unsafeAssetName = name => privateNames.has(name.toLowerCase())
  || /^wrangler\.(?:json|jsonc|toml)$/i.test(name)
  || /\.(?:md|markdown|env|pem|key|p12|pfx|jks|keystore|kdbx)$/i.test(name)
  || /^(?:\.env|\.dev\.vars)(?:\.|$)/i.test(name)
  || /(?:^|[._-])(?:credentials?|secrets?)(?:\.(?:json|toml|ya?ml|txt)|$)/i.test(name)
  || /^(?:id_(?:rsa|dsa|ecdsa|ed25519)|auth[-_]?state|storage[-_]?state|service[-_]?account|credentials?|secrets?)(?:[._-]|$)/i.test(name);
const MAX_ASSET_COUNT = 20_000;
const MAX_ASSET_BYTES = 25 * 1024 * 1024;

/** A deterministic, byte-level inventory of static files suitable for the Free plan. */
export async function assetManifest(root) {
  try {
    if (!(await lstat(root)).isDirectory()) throw new Error();
    const files = [];
    async function walk(directory, prefix = '') {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        if (unsafeAssetName(entry.name) || entry.isSymbolicLink()) throw new Error();
        const path = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) await walk(join(directory, entry.name), path);
        else if (entry.isFile()) {
          files.push(path);
          if (files.length > MAX_ASSET_COUNT) throw new Error();
        } else throw new Error();
      }
    }
    await walk(root);
    const entries = [];
    for (const path of files.sort()) {
      const handle = await open(join(root, path), constants.O_RDONLY | constants.O_NOFOLLOW);
      try {
        const stat = await handle.stat();
        if (!stat.isFile() || stat.size > MAX_ASSET_BYTES) throw new Error();
        const data = await handle.readFile();
        if (data.length > MAX_ASSET_BYTES || data.length !== stat.size) throw new Error();
        entries.push([path, createHash('sha256').update(data).digest('hex')]);
      } finally { await handle.close(); }
    }
    return Object.fromEntries(entries);
  } catch {
    throw new Error('Invalid static asset directory.');
  }
}

async function canonicalPath(path) {
  try { return await realpath(path); } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return join(await canonicalPath(dirname(path)), basename(path));
  }
}

const contains = (parent, child) => {
  const path = relative(parent, child);
  return path === '' || (path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path));
};

/** Create a new deployable tree; never mutate the last successfully published tree. */
export async function stageCalendarRefresh({ publishedDir, snapshotFile, stagingDir, now = Date.now() }) {
  let stagedPath;
  let created = false;
  try {
    const snapshots = validateAvailabilitySnapshots(JSON.parse(await readFile(snapshotFile, 'utf8')), now);
    const original = await assetManifest(publishedDir);
    const sourcePath = await realpath(publishedDir);
    const requestedPath = resolve(stagingDir);
    try {
      await lstat(requestedPath);
      throw new Error();
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    stagedPath = await canonicalPath(requestedPath);
    if (contains(sourcePath, stagedPath) || contains(stagedPath, sourcePath)) throw new Error();
    const calendars = new Set(AVAILABILITY_PROPERTIES.map(property => `availability/${property}.json`));
    if ([...calendars].some(path => !Object.hasOwn(original, path))) throw new Error();

    await mkdir(dirname(stagedPath), { recursive: true });
    await mkdir(stagedPath);
    created = true;
    for (const path of Object.keys(original)) {
      await mkdir(dirname(join(stagedPath, path)), { recursive: true });
      await copyFile(join(sourcePath, path), join(stagedPath, path), constants.COPYFILE_EXCL);
    }
    for (const property of AVAILABILITY_PROPERTIES) {
      await writeFile(join(stagedPath, 'availability', `${property}.json`), `${JSON.stringify(snapshots[property], null, 2)}\n`);
    }
    const manifest = await assetManifest(stagedPath);
    const changedPaths = Object.keys(manifest).filter(path => manifest[path] !== original[path]);
    if (Object.keys(manifest).length !== Object.keys(original).length
        || Object.keys(original).some(path => !Object.hasOwn(manifest, path))
        || changedPaths.some(path => !calendars.has(path))
        || JSON.stringify(await assetManifest(publishedDir)) !== JSON.stringify(original)) throw new Error();
    return { manifest, snapshots, changedPaths };
  } catch {
    if (created) await rm(stagedPath, { recursive: true, force: true }).catch(() => {});
    throw new Error('Calendar refresh could not be staged.');
  }
}
