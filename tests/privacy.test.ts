import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const library = new URL('../scripts/lib/private-identity.mjs', import.meta.url);
const verifier = fileURLToPath(new URL('../scripts/verify-privacy.mjs', import.meta.url));
const terms = ['Avery', 'Secretfamily', 'averyprivate', 'Авери', 'B409'];

async function privacy() {
  assert.ok(existsSync(library), 'The shared private identity checker must exist');
  return import(library.href);
}

test('private matching terms are required, validated and never included in errors', async () => {
  const { loadPrivateIdentityTerms } = await privacy();
  for (const value of ['', 'null', '[]', '[1]', '[""]', '{"bad":true}', 'invalid']) {
    assert.throws(() => loadPrivateIdentityTerms(value), /PRIVATE_IDENTITY_TERMS_JSON/);
  }
  assert.deepEqual(loadPrivateIdentityTerms(JSON.stringify(terms)), terms);
});

test('private identities are caught in copy, code, email and escaped strings', async () => {
  const { createPrivateIdentityCheck } = await privacy();
  const check = createPrivateIdentityCheck(terms);
  for (const value of ['Hi AVERY!', 'Secretfamily', 'averyprivate@example.test', String.raw`/\bAvery\b/i`, String.raw`\u0041very`, '%41very', 'b409', 'room=B409', String.raw`/(?:B409|C510)/`, encodeURIComponent('Авери')]) {
    assert.throws(() => check(value, 'fixture'), /Private identity found in fixture/);
  }
  assert.doesNotThrow(() => check('The Title V: bravery, secretfamilies, B4090, and renting in Argentina.', 'fixture'));
  try { check('Avery', 'fixture'); } catch (error) {
    assert.doesNotMatch(String(error), /Avery/);
  }
});

function repository(t: { after: (callback: () => void) => void }) {
  const cwd = mkdtempSync(join(tmpdir(), 'title-v-privacy-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args: string[]) => execFileSync('git', args, { cwd, stdio: 'pipe' });
  git('init', '-q');
  git('config', 'user.name', 'The Title V');
  git('config', 'user.email', 'booking@example.test');
  writeFileSync(join(cwd, 'site.txt'), 'The Title V');
  git('add', 'site.txt');
  git('commit', '-qm', 'Initial site');
  const verify = () => spawnSync(process.execPath, [verifier], {
    cwd, encoding: 'utf8', env: { ...process.env, PRIVATE_IDENTITY_TERMS_JSON: JSON.stringify(terms) },
  });
  return { cwd, git, verify };
}

test('repository privacy scan accepts a clean repository and rejects a tracked source leak', t => {
  const { cwd, verify } = repository(t);
  const clean = verify();
  assert.equal(clean.status, 0, clean.stderr);
  writeFileSync(join(cwd, 'site.txt'), 'Contact Avery');
  const leaked = verify();
  assert.notEqual(leaked.status, 0);
  assert.match(leaked.stderr, /Private identity found/);
  assert.doesNotMatch(leaked.stderr, /Avery/);
});

test('repository privacy scan rejects private author metadata in an ancestor commit', t => {
  const { git, verify } = repository(t);
  git('-c', 'user.name=Avery', 'commit', '--allow-empty', '-qm', 'Old update');
  git('commit', '--allow-empty', '-qm', 'Clean tip');
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Private identity found in commit/);
});

test('repository privacy scan rejects leaked content that was deleted from the latest tree', t => {
  const { cwd, git, verify } = repository(t);
  writeFileSync(join(cwd, 'old.txt'), 'Avery');
  git('add', 'old.txt');
  git('commit', '-qm', 'Old source');
  git('rm', '-q', 'old.txt');
  git('commit', '-qm', 'Delete old source');
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Private identity found in blob/);
});

test('Git replacement refs cannot hide the original author that a branch push would publish', t => {
  const { git, verify } = repository(t);
  git('-c', 'user.name=Avery', 'commit', '--allow-empty', '-qm', 'Private author');
  const original = git('rev-parse', 'HEAD').toString().trim();
  const tree = git('rev-parse', 'HEAD^{tree}').toString().trim();
  const replacement = git('commit-tree', tree, '-m', 'Neutral replacement').toString().trim();
  git('replace', original, replacement);
  const result = verify();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Private identity found in commit/);
});
