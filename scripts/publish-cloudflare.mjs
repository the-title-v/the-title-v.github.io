import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { cp, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AVAILABILITY_PROPERTIES, assetManifest, stageCalendarRefresh, validateAvailabilitySnapshots } from './lib/cloudflare-release.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);
const mode = process.argv[2];
assert(['initial', 'release', 'calendar'].includes(mode), 'Choose initial, release, or calendar publication.');
const stateDir = resolve(process.env.CLOUDFLARE_STATE_DIR || '.cache/cloudflare-release');
const siteUrl = 'https://stay.the-title-v.workers.dev';
const runId = `${new Date().toISOString().replaceAll(':', '-')}-${randomUUID().slice(0, 8)}`;
const runDir = join(stateDir, 'releases', runId);
const config = join(runDir, 'wrangler.json');
const assets = join(runDir, 'assets');
const stateFile = join(stateDir, 'current.json');
const pendingFile = join(stateDir, 'pending.json');
const lock = join(stateDir, 'publish.lock');
const calendarPaths = AVAILABILITY_PROPERTIES.map(p => `availability/${p}.json`);
let locked = false;
let logNumber = 0;

async function readJson(path, fallback) {
  try { return JSON.parse(await readFile(path, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return fallback; throw error; }
}
async function saveJson(path, value) {
  await writeFile(`${path}.tmp`, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  await rename(`${path}.tmp`, path);
}
async function command(args, { wrangler = false, allowMissing = false, env = {} } = {}) {
  const childEnv = { ...process.env, ...env, WRANGLER_SEND_METRICS: 'false',
    WRANGLER_LOG_PATH: join(runDir, 'wrangler.log'), CI: 'true' };
  if (wrangler) for (const key of Object.keys(childEnv)) {
    if (/^(AIRBNB_|PRIVATE_)/.test(key)) delete childEnv[key];
  }
  const result = spawnSync(process.execPath, args, {
    cwd: wrangler ? runDir : root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: childEnv,
    timeout: 180_000,
  });
  const output = `${result.stdout || ''}${result.stderr || ''}`;
  await writeFile(join(runDir, `${++logNumber}-${wrangler ? 'wrangler' : 'check'}.log`), output, { mode: 0o600 });
  if (result.error || result.status !== 0) {
    if (allowMissing && !result.error && /\[code: 10007\]/.test(output)) return null;
    throw new Error(`Publication command failed; inspect local run logs (${logNumber}).`);
  }
  return result.stdout;
}
const cli = (args, options = {}) => command([join(root, 'node_modules/wrangler/bin/wrangler.js'), ...args, '--config', config], { ...options, wrangler: true });
async function currentDeployment(allowMissing = false) {
  const output = await cli(['deployments', 'list', '--json'], { allowMissing });
  if (output === null) return null;
  const values = JSON.parse(output);
  assert(Array.isArray(values), 'Unexpected Cloudflare deployment response.');
  return values.toSorted((a, b) => b.created_on.localeCompare(a.created_on))[0] || null;
}
async function snapshotsIn(directory) {
  return validateAvailabilitySnapshots(Object.fromEntries(await Promise.all(AVAILABILITY_PROPERTIES.map(async p =>
    [p, JSON.parse(await readFile(join(directory, 'availability', `${p}.json`), 'utf8'))]))));
}
async function verifyLive(manifest) {
  const paths = Object.keys(manifest).filter(path => path.endsWith('.html') || calendarPaths.includes(path)
    || /\.(js|css)$/.test(path) || ['favicon.svg', 'sitemap.xml', 'robots.txt'].includes(path));
  for (let attempt = 0; attempt < 6; attempt++) {
    try {
      for (let offset = 0; offset < paths.length; offset += 6) {
        await Promise.all(paths.slice(offset, offset + 6).map(async path => {
          const route = path === '404.html' ? `missing-page-${runId}/`
            : path.endsWith('index.html') ? path.slice(0, -10) : path;
          const response = await fetch(`${siteUrl}/${route}`, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
          assert.equal(response.status, path === '404.html' ? 404 : 200, 'Unexpected live route status.');
          const bytes = Buffer.from(await response.arrayBuffer());
          assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest[path], 'Live file does not match staged release.');
          if (calendarPaths.includes(path)) assert.match(response.headers.get('cache-control') || '', /no-store/, 'Calendar caching must be disabled.');
        }));
      }
      return paths.length;
    } catch (error) {
      if (attempt === 5) throw error;
      await new Promise(resolve => setTimeout(resolve, 3_000));
    }
  }
}

try {
  await mkdir(stateDir, { recursive: true, mode: 0o700 });
  await mkdir(lock); locked = true;
  await writeFile(join(lock, 'owner.json'), JSON.stringify({ pid: process.pid, runId }), { mode: 0o600 });
  assert.equal(await readJson(pendingFile, null), null, 'An earlier deployment needs recovery before publishing again.');
  await mkdir(runDir, { recursive: true, mode: 0o700 });
  const deploymentConfig = JSON.parse(await readFile(join(root, 'wrangler.jsonc'), 'utf8'));
  delete deploymentConfig.$schema;
  deploymentConfig.assets.directory = assets;
  await saveJson(config, deploymentConfig);
  const previous = await readJson(stateFile, null);
  assert(mode === 'initial' ? previous === null : previous !== null, 'Publication mode does not match local release state.');
  const before = await currentDeployment(mode === 'initial');
  assert.equal(before?.id || null, previous?.deploymentId || null, 'Cloudflare changed outside this publisher; reconcile before publishing.');
  if (previous) {
    assert.equal(previous.siteUrl, siteUrl, 'Local release belongs to another site.');
    assert.deepEqual(await assetManifest(previous.assets), previous.manifest, 'Saved release files have changed.');
  }
  let changedPaths;
  if (mode === 'calendar') {
    await command(['--import', 'tsx', 'scripts/sync-availability.ts']);
    ({ changedPaths } = await stageCalendarRefresh({ publishedDir: previous.assets,
      snapshotFile: join(root, '.cache/availability.json'), stagingDir: assets }));
  } else {
    const source = resolve(process.env.CLOUDFLARE_ASSET_DIR || 'dist');
    const original = await assetManifest(source);
    await cp(source, assets, { recursive: true, errorOnExist: true, force: false });
    assert.deepEqual(await assetManifest(assets), original, 'Release changed while staging.');
    changedPaths = Object.keys(original).filter(path => previous?.manifest[path] !== original[path]);
  }
  const snapshots = await snapshotsIn(assets);
  const manifest = await assetManifest(assets);
  const homepage = await readFile(join(assets, 'index.html'), 'utf8');
  assert(homepage.includes(`rel="canonical" href="${siteUrl}/"`), 'Build with the Cloudflare site URL.');
  await command(['scripts/verify-privacy.mjs']);
  await command(['--import', 'tsx', 'scripts/verify-build.mjs'], { env: { VERIFY_BUILD_DIR: assets, VERIFY_FRESH_AVAILABILITY: '1' } });
  assert.equal((await currentDeployment(mode === 'initial'))?.id || null, before?.id || null, 'Concurrent Cloudflare publication detected.');
  await saveJson(pendingFile, { runId, assets, manifest, siteUrl, previousDeploymentId: before?.id || null });
  console.log(`Publishing ${Object.keys(manifest).length} static assets (${changedPaths.length} changed files).`);
  const deployedOutput = await cli(['deploy', '--assets', assets, '--strict', '--message', mode === 'calendar' ? 'Refresh public availability' : 'Publish The Title V static website']);
  const versionId = deployedOutput.match(/Current Version ID:\s*([\da-f-]{36})/i)?.[1];
  assert(versionId, 'Cloudflare did not return a version ID; inspect pending deployment.');
  const deployed = await currentDeployment();
  assert(deployed?.id !== before?.id && deployed?.versions?.length === 1
    && deployed.versions[0].version_id === versionId && deployed.versions[0].percentage === 100,
  'Live deployment does not match the uploaded release.');
  const verifiedRoutes = await verifyLive(manifest);
  assert.equal((await currentDeployment())?.id, deployed.id, 'Cloudflare changed during live verification.');
  const previousHistory = previous?.history || (previous ? [previous.runId] : []);
  const history = [runId, ...previousHistory].slice(0, 3);
  await saveJson(stateFile, { runId, assets, manifest, siteUrl, deploymentId: deployed.id, versionId, history,
    checkedAt: new Date().toISOString(), snapshots, changedPaths, verifiedRoutes });
  await rm(pendingFile);
  for (const oldRun of previousHistory.filter(id => !history.includes(id))) {
    if (/^\d{4}-\d{2}-\d{2}T[\d.-]+Z-[a-f\d]{8}$/.test(oldRun)) {
      await rm(join(stateDir, 'releases', oldRun, 'assets'), { recursive: true, force: true });
    }
  }
  console.log(`Verified ${verifiedRoutes} live pages/assets/calendars: ${siteUrl}`);
  console.log('Saved the verified release locally for the next calendar-only update.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  if (locked) await rm(lock, { recursive: true, force: true });
}
