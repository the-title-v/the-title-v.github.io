import test, { type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const publisher = fileURLToPath(new URL('../scripts/publish-cloudflare.mjs', import.meta.url));
const modes = ['initial', 'release', 'calendar'];

async function fixture(t: TestContext) {
  const directory = await mkdtemp(join(tmpdir(), 'title-v-publisher-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const stateDir = join(directory, 'state');
  const guard = join(directory, 'offline-guard.mjs');
  const attempts = join(directory, 'external-io-attempts');
  // These tests exercise real filesystem guards. A regression must fail before
  // it can start Wrangler, another subprocess, or a network connection.
  await writeFile(guard, String.raw`
import { appendFileSync } from 'node:fs';
import childProcess from 'node:child_process';
import net from 'node:net';
import tls from 'node:tls';
import { syncBuiltinESMExports } from 'node:module';
const deny = () => {
  appendFileSync(process.env.PUBLISHER_TEST_IO_MARKER, 'blocked\n');
  throw new Error('Unexpected external I/O in publisher guard test.');
};
for (const method of ['spawn', 'spawnSync', 'exec', 'execSync', 'execFile', 'execFileSync', 'fork']) childProcess[method] = deny;
net.Socket.prototype.connect = deny;
net.connect = net.createConnection = tls.connect = globalThis.fetch = deny;
syncBuiltinESMExports();
`);
  const publish = async (mode?: string) => {
    const result = spawnSync(process.execPath, ['--import', guard, publisher, ...(mode ? [mode] : [])], {
      cwd: directory,
      encoding: 'utf8',
      timeout: 5_000,
      maxBuffer: 128 * 1024,
      env: { CLOUDFLARE_STATE_DIR: stateDir, PUBLISHER_TEST_IO_MARKER: attempts },
    });
    assert.equal(result.error, undefined);
    assert.equal(result.signal, null);
    assert.equal(result.status, 1, result.stderr);
    assert.equal(result.stdout, '');
    await assert.rejects(lstat(attempts), { code: 'ENOENT' });
    return result;
  };
  return { stateDir, publish };
}

async function diskSnapshot(path: string): Promise<unknown> {
  const stat = await lstat(path, { bigint: true });
  const metadata = { inode: stat.ino, mode: stat.mode, mtime: stat.mtimeNs, ctime: stat.ctimeNs };
  if (!stat.isDirectory()) return { ...metadata, bytes: await readFile(path) };
  const entries = await Promise.all((await readdir(path)).sort()
    .map(async name => [name, await diskSnapshot(join(path, name))]));
  return { ...metadata, entries: Object.fromEntries(entries) };
}

test('invalid publication modes fail before creating local state', async t => {
  const { stateDir, publish } = await fixture(t);
  for (const mode of [undefined, 'invalid']) {
    const result = await publish(mode);
    assert.match(result.stderr, /Choose initial, release, or calendar publication/);
    await assert.rejects(lstat(stateDir), { code: 'ENOENT' });
  }
});

test('an existing publication lock prevents all modes and remains unchanged', async t => {
  const { stateDir, publish } = await fixture(t);
  const lock = join(stateDir, 'publish.lock');
  await mkdir(lock, { recursive: true });
  await writeFile(join(lock, 'owner.json'), '{"pid":12345,"runId":"another-local-publication"}\n');
  const before = await diskSnapshot(stateDir);
  for (const mode of modes) {
    const result = await publish(mode);
    assert.match(result.stderr, /EEXIST/);
    assert.deepEqual(await diskSnapshot(stateDir), before);
  }
});

test('pending recovery preserves saved releases and removes only its own lock', async t => {
  const { stateDir, publish } = await fixture(t);
  const assets = join(stateDir, 'saved-assets');
  const otherLock = join(stateDir, 'other.lock');
  await mkdir(assets, { recursive: true });
  await mkdir(otherLock);
  await writeFile(join(assets, 'index.html'), '<html><body>Preserve the verified release.</body></html>');
  await writeFile(join(assets, 'photo.jpg'), Buffer.from([0, 255, 127, 10]));
  await writeFile(join(otherLock, 'owner.json'), '{"owner":"unrelated-local-operation"}\n');
  await writeFile(join(stateDir, 'current.json'), JSON.stringify({ deploymentId: 'verified-release', assets }) + '\n');
  await writeFile(join(stateDir, 'pending.json'), JSON.stringify({ runId: 'unverified-release', assets }) + '\n');
  const protectedPaths = ['current.json', 'pending.json', 'saved-assets', 'other.lock'];
  const before = await Promise.all(protectedPaths.map(path => diskSnapshot(join(stateDir, path))));
  for (const mode of modes) {
    const result = await publish(mode);
    assert.match(result.stderr, /An earlier deployment needs recovery before publishing again/);
    assert.deepEqual(await Promise.all(protectedPaths.map(path => diskSnapshot(join(stateDir, path)))), before);
    assert.deepEqual((await readdir(stateDir)).sort(), [...protectedPaths].sort());
    await assert.rejects(lstat(join(stateDir, 'publish.lock')), { code: 'ENOENT' });
    await assert.rejects(lstat(join(stateDir, 'releases')), { code: 'ENOENT' });
  }
});
