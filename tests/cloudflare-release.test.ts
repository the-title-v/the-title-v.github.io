import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { lstat, mkdir, mkdtemp, readFile, rm, symlink, truncate, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import * as release from '../scripts/lib/cloudflare-release.mjs';
import { AVAILABILITY_PROPERTIES } from '../src/lib/availability-policy.ts';

type Snapshot = { status: string; blocked: { start: string; end: string }[]; checkedAt: string | null };
type Snapshots = Record<string, Snapshot>;
const [first, second, combined] = AVAILABILITY_PROPERTIES;
const now = Date.parse('2026-10-23T12:10:00.000Z');
const checkedAt = '2026-10-23T12:00:00.000Z';

function snapshots(): Snapshots {
  return {
    [first]: { status: 'snapshot', blocked: [{ start: '2027-01-04', end: '2027-01-08' }, { start: '2027-01-12', end: '2027-01-14' }], checkedAt },
    [second]: { status: 'snapshot', blocked: [{ start: '2027-01-07', end: '2027-01-10' }, { start: '2027-01-14', end: '2027-01-18' }], checkedAt: '2026-10-23T12:02:00.000Z' },
    [combined]: { status: 'snapshot', blocked: [{ start: '2027-01-04', end: '2027-01-10' }, { start: '2027-01-12', end: '2027-01-18' }], checkedAt },
  };
}

test('validates all public snapshots and returns independent sanitized values', () => {
  const input = snapshots();
  const result = release.validateAvailabilitySnapshots(input, now);
  assert.deepEqual(release.AVAILABILITY_PROPERTIES, AVAILABILITY_PROPERTIES);
  assert.deepEqual(result, input);
  assert.notEqual(result, input);
  assert.notEqual(result[first].blocked, input[first].blocked);
  assert.notEqual(result[first].blocked[0], input[first].blocked[0]);
});

test('requires exactly the three public properties and exact snapshot/range fields', () => {
  const inputs: unknown[] = [null, [], {}, { ...snapshots(), extra: {} }];
  const missing = snapshots();
  delete missing[second];
  inputs.push(missing);
  inputs.push({ ...snapshots(), [first]: { ...snapshots()[first], sourceUrl: 'PRIVATE_TEST_MARKER' } });
  inputs.push({ ...snapshots(), [first]: { ...snapshots()[first], blocked: [{ start: '2027-01-04', end: '2027-01-08', summary: 'PRIVATE_TEST_MARKER' }] } });
  for (const input of inputs) {
    assert.throws(() => release.validateAvailabilitySnapshots(input, now), error => {
      assert.equal((error as Error).message, 'Invalid availability snapshot.');
      return true;
    });
  }
});

test('rejects failed, future, stale, and noncanonical snapshot checks', () => {
  for (const invalid of [
    { status: 'unavailable', checkedAt: null },
    { status: 'live' },
    { checkedAt: '2026-10-23T12:10:00.001Z' },
    { checkedAt: '2026-10-23T11:55:00.000Z' },
    { checkedAt: '2026-10-23T12:00:00Z' },
    { checkedAt: '2026-10-23T12:00:00.000+00:00' },
    { checkedAt: '2026-02-30T12:00:00.000Z' },
    { checkedAt: 'PRIVATE_TEST_MARKER' },
  ]) {
    const input = snapshots();
    Object.assign(input[first], invalid);
    assert.throws(() => release.validateAvailabilitySnapshots(input, now), /^Error: Invalid availability snapshot\.$/);
  }
  assert.throws(() => release.validateAvailabilitySnapshots(snapshots(), Number.NaN));
  assert.throws(() => release.validateAvailabilitySnapshots(snapshots(), now, 0));
  assert.throws(() => release.validateAvailabilitySnapshots(snapshots(), now, 10 * 60 * 1000));
});

test('accepts a just-checked snapshot and a custom freshness window', () => {
  const input = snapshots();
  for (const snapshot of Object.values(input)) snapshot.checkedAt = new Date(now).toISOString();
  assert.deepEqual(release.validateAvailabilitySnapshots(input, now), input);
  assert.deepEqual(release.validateAvailabilitySnapshots(snapshots(), now, 11 * 60 * 1000), snapshots());
});

test('rejects invalid, unordered, overlapping, and unmerged date ranges', () => {
  for (const blocked of [
    [{ start: '2027-02-30', end: '2027-03-02' }],
    [{ start: '2027-1-04', end: '2027-01-08' }],
    [{ start: '2027-01-04', end: '2027-01-04' }],
    [{ start: '2027-01-08', end: '2027-01-04' }],
    [{ start: '2027-01-12', end: '2027-01-14' }, { start: '2027-01-04', end: '2027-01-08' }],
    [{ start: '2027-01-04', end: '2027-01-08' }, { start: '2027-01-07', end: '2027-01-10' }],
    [{ start: '2027-01-04', end: '2027-01-08' }, { start: '2027-01-08', end: '2027-01-10' }],
  ]) {
    const input = snapshots();
    input[first].blocked = blocked;
    assert.throws(() => release.validateAvailabilitySnapshots(input, now));
  }
});

test('requires the combined calendar to equal the union and the older check', () => {
  for (const mutate of [
    (input: Snapshots) => { input[combined].blocked = []; },
    (input: Snapshots) => { input[combined].blocked[0].end = '2027-01-11'; },
    (input: Snapshots) => { input[combined].checkedAt = input[second].checkedAt; },
  ]) {
    const input = snapshots();
    mutate(input);
    assert.throws(() => release.validateAvailabilitySnapshots(input, now));
  }
  const input = snapshots();
  input[first].checkedAt = input[second].checkedAt;
  input[second].checkedAt = checkedAt;
  assert.deepEqual(release.validateAvailabilitySnapshots(input, now), input);
});

test('accepts successfully checked empty calendars without inventing blocked dates', () => {
  const input = snapshots();
  for (const snapshot of Object.values(input)) snapshot.blocked = [];
  assert.deepEqual(release.validateAvailabilitySnapshots(input, now), input);
});

async function inDirectory(run: (dir: string) => Promise<void>) {
  const dir = await mkdtemp(join(tmpdir(), 'title-v-release-'));
  try { await run(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}

test('manifests static assets deterministically and permits public dot paths', async () => {
  await inDirectory(async dir => {
    const files = { 'z.txt': 'last', 'images/photo.jpg': Buffer.from([0, 255, 127]), '.nojekyll': '', '.well-known/security.txt': 'public contact' };
    for (const [path, data] of Object.entries(files)) {
      await mkdir(dirname(join(dir, path)), { recursive: true });
      await writeFile(join(dir, path), data);
    }
    const expected = Object.fromEntries(Object.entries(files).sort(([a], [b]) => a < b ? -1 : 1)
      .map(([path, data]) => [path, createHash('sha256').update(data).digest('hex')]));
    const manifest = await release.assetManifest(dir);
    assert.deepEqual(manifest, expected);
    assert.deepEqual(Object.keys(manifest), Object.keys(expected));
    assert.deepEqual(await release.assetManifest(dir), manifest);
  });
});

test('rejects Markdown, runtime directories, and obvious credential files', async () => {
  for (const path of ['ReadMe.MD', 'notes.MarkDown', '.env', '.env.production', 'production.env', '.dev.vars', 'account.pem', '.netrc', '.htpasswd',
    'credentials.json', 'exported-credentials.json', 'service-account.json', 'auth-state.json', 'id_ed25519', '.git/config', 'node_modules/module.js',
    'server/entry.mjs', '.wrangler/config.json']) {
    await inDirectory(async dir => {
      await mkdir(dirname(join(dir, path)), { recursive: true });
      await writeFile(join(dir, path), 'PRIVATE_TEST_MARKER');
      await assert.rejects(release.assetManifest(dir), error => {
        assert.equal((error as Error).message, 'Invalid static asset directory.');
        return true;
      });
    });
  }
});

test('rejects local configuration directories and deployment configuration files', async () => {
  for (const path of ['config/agent.json', 'private/calendar.json', 'nested/CONFIG/agent.json',
    'wrangler.json', 'wrangler.jsonc', 'wrangler.toml', 'nested/WRANGLER.JSONC']) {
    await inDirectory(async dir => {
      await mkdir(dirname(join(dir, path)), { recursive: true });
      await writeFile(join(dir, path), 'PRIVATE_TEST_MARKER');
      await assert.rejects(release.assetManifest(dir), /^Error: Invalid static asset directory\.$/);
    });
  }
});

test('rejects symbolic links at the asset root and within it', async () => {
  await inDirectory(async dir => {
    const root = join(dir, 'assets');
    await mkdir(root);
    await writeFile(join(dir, 'private.txt'), 'PRIVATE_TEST_MARKER');
    await symlink(join(dir, 'private.txt'), join(root, 'public.txt'));
    await assert.rejects(release.assetManifest(root));
    await rm(join(root, 'public.txt'));
    await symlink(root, join(dir, 'alias'));
    await assert.rejects(release.assetManifest(join(dir, 'alias')));
    assert.equal(await readFile(join(dir, 'private.txt'), 'utf8'), 'PRIVATE_TEST_MARKER');
  });
});

test('enforces the 25 MiB individual asset limit', async () => {
  await inDirectory(async dir => {
    const path = join(dir, 'large.bin');
    await writeFile(path, '');
    await truncate(path, 25 * 1024 * 1024);
    assert.deepEqual(Object.keys(await release.assetManifest(dir)), ['large.bin']);
    await truncate(path, 25 * 1024 * 1024 + 1);
    await assert.rejects(release.assetManifest(dir));
  });
});

test('enforces the 20,000 asset Free plan limit', async () => {
  await inDirectory(async dir => {
    for (let offset = 0; offset < 20_000; offset += 200) {
      await Promise.all(Array.from({ length: 200 }, (_, index) => writeFile(join(dir, `${offset + index}.txt`), '')));
    }
    assert.equal(Object.keys(await release.assetManifest(dir)).length, 20_000);
    await writeFile(join(dir, 'one-too-many.txt'), '');
    await assert.rejects(release.assetManifest(dir));
  });
});

async function publishedSite(dir: string) {
  const publishedDir = join(dir, 'published');
  const snapshotFile = join(dir, 'snapshot.json');
  const stagingDir = join(dir, 'staged');
  await mkdir(join(publishedDir, 'availability'), { recursive: true });
  await mkdir(join(publishedDir, 'images'));
  await writeFile(join(publishedDir, 'index.html'), '<html><body>Preserve the latest published page.</body></html>');
  await writeFile(join(publishedDir, 'images', 'apartment.jpg'), Buffer.from([0, 255, 127, 0, 10]));
  await writeFile(join(publishedDir, '_headers'), '/availability/*\n  Cache-Control: no-store\n');
  for (const property of AVAILABILITY_PROPERTIES) {
    await writeFile(join(publishedDir, 'availability', `${property}.json`), JSON.stringify({ ...snapshots()[property], checkedAt: '2026-10-23T10:00:00.000Z' }));
  }
  await writeFile(snapshotFile, JSON.stringify(snapshots()));
  return { publishedDir, snapshotFile, stagingDir, now };
}

test('stages only the three calendar replacements and preserves every other byte', async () => {
  await inDirectory(async dir => {
    const options = await publishedSite(dir);
    const before = await release.assetManifest(options.publishedDir);
    const result = await release.stageCalendarRefresh(options);
    const expectedPaths = AVAILABILITY_PROPERTIES.map(property => `availability/${property}.json`).sort();
    assert.deepEqual(result.changedPaths, expectedPaths);
    assert.deepEqual(result.snapshots, snapshots());
    assert.deepEqual(result.manifest, await release.assetManifest(options.stagingDir));
    assert.deepEqual(Object.keys(result.manifest), Object.keys(before));
    for (const path of Object.keys(before).filter(path => !expectedPaths.includes(path))) {
      assert.equal(result.manifest[path], before[path]);
    }
    for (const property of AVAILABILITY_PROPERTIES) {
      assert.deepEqual(JSON.parse(await readFile(join(options.stagingDir, 'availability', `${property}.json`), 'utf8')), snapshots()[property]);
    }
    assert.deepEqual(await release.assetManifest(options.publishedDir), before);
  });
});

test('rejects malformed or incomplete imports before creating any staged assets', async () => {
  await inDirectory(async dir => {
    const options = await publishedSite(dir);
    const before = await release.assetManifest(options.publishedDir);
    for (const input of [
      'PRIVATE_TEST_MARKER', '{}',
      JSON.stringify({ ...snapshots(), [second]: { status: 'unavailable', blocked: [], checkedAt: null } }),
      JSON.stringify({ ...snapshots(), [first]: { ...snapshots()[first], privateUrl: 'PRIVATE_TEST_MARKER' } }),
    ]) {
      await writeFile(options.snapshotFile, input);
      await assert.rejects(release.stageCalendarRefresh(options), error => {
        assert.equal((error as Error).message, 'Calendar refresh could not be staged.');
        return true;
      });
      await assert.rejects(lstat(options.stagingDir), { code: 'ENOENT' });
      assert.deepEqual(await release.assetManifest(options.publishedDir), before);
    }
  });
});

test('rejects a published base missing one calendar without changing the source', async () => {
  await inDirectory(async dir => {
    const options = await publishedSite(dir);
    await rm(join(options.publishedDir, 'availability', `${second}.json`));
    const before = await release.assetManifest(options.publishedDir);
    await assert.rejects(release.stageCalendarRefresh(options));
    await assert.rejects(lstat(options.stagingDir), { code: 'ENOENT' });
    assert.deepEqual(await release.assetManifest(options.publishedDir), before);
  });
});

test('never replaces an existing staging directory or stages inside the published source', async () => {
  await inDirectory(async dir => {
    const options = await publishedSite(dir);
    await mkdir(options.stagingDir);
    await writeFile(join(options.stagingDir, 'keep.txt'), 'existing stage');
    const before = await release.assetManifest(options.publishedDir);
    for (const stagingDir of [options.stagingDir, options.publishedDir, join(options.publishedDir, 'nested-stage')]) {
      await assert.rejects(release.stageCalendarRefresh({ ...options, stagingDir }));
    }
    assert.equal(await readFile(join(options.stagingDir, 'keep.txt'), 'utf8'), 'existing stage');
    await assert.rejects(lstat(join(options.publishedDir, 'nested-stage')), { code: 'ENOENT' });
    assert.deepEqual(await release.assetManifest(options.publishedDir), before);
  });
});

test('detects overlapping staging paths reached through symbolic-link parents', async () => {
  await inDirectory(async dir => {
    const options = await publishedSite(dir);
    const alias = join(dir, 'published-alias');
    await symlink(options.publishedDir, alias);
    await assert.rejects(release.stageCalendarRefresh({ ...options, stagingDir: join(alias, 'nested-stage') }));
    await assert.rejects(lstat(join(options.publishedDir, 'nested-stage')), { code: 'ENOENT' });
  });
});

test('supports a fresh nested staging path and reports no changes for identical snapshots', async () => {
  await inDirectory(async dir => {
    const options = await publishedSite(dir);
    for (const property of AVAILABILITY_PROPERTIES) {
      await writeFile(join(options.publishedDir, 'availability', `${property}.json`), `${JSON.stringify(snapshots()[property], null, 2)}\n`);
    }
    const result = await release.stageCalendarRefresh({ ...options, stagingDir: join(dir, 'new-parent', 'stage') });
    assert.deepEqual(result.changedPaths, []);
    assert.deepEqual(result.manifest, await release.assetManifest(options.publishedDir));
  });
});
