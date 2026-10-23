import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('the public rates page leaves the historical pricing rationale in internal documentation', async () => {
  const source = await readFile(new URL('../src/pages/rates.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /historical stays|recorded income|How the reference was calculated/i);
  assert.match(source, /7-night minimum/);
});
