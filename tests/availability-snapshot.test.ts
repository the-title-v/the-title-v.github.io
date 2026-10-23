import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeAvailabilitySnapshot, readAvailabilitySnapshot } from '../scripts/lib/availability-snapshot.ts';

const properties = ['bright-1br-rawai-beach', 'cozy-1br-rawai-beach', 'two-adjacent-apartments-title-v-rawai'];
const checkedAt = '2026-10-23T12:00:00.000Z';
const blocked = [{ start: '2027-01-04', end: '2027-01-08' }];

test('publishes only sanitized snapshot fields for all three options', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'title-v-snapshot-'));
  const path = join(dir, 'snapshot.json');
  try {
    await writeAvailabilitySnapshot(path, async () => ({ status: 'live', blocked: [{ ...blocked[0], summary: 'PRIVATE' }], checkedAt, privateUrl: 'SECRET' }));
    const output = await readFile(path, 'utf8');
    assert.doesNotMatch(output, /PRIVATE|SECRET|summary|privateUrl/);
    const snapshot = await readAvailabilitySnapshot(path);
    assert.deepEqual(Object.keys(snapshot).sort(), [...properties].sort());
    for (const property of properties) assert.deepEqual(snapshot[property], { status: 'snapshot', blocked, checkedAt });
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('a failed calendar import cannot replace a previously published snapshot', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'title-v-snapshot-'));
  const path = join(dir, 'snapshot.json');
  try {
    await writeFile(path, 'previous snapshot');
    await assert.rejects(writeAvailabilitySnapshot(path, async property => property === properties[1]
      ? { status: 'unavailable', blocked: [], checkedAt: null }
      : { status: 'live', blocked, checkedAt }), /Calendar import incomplete/);
    assert.equal(await readFile(path, 'utf8'), 'previous snapshot');
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('missing or malformed build data produces unverified calendars rather than open dates', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'title-v-snapshot-'));
  const path = join(dir, 'snapshot.json');
  try {
    for (const source of [null, '<html>error</html>', '{}', JSON.stringify(Object.fromEntries(properties.map(property => [property, { status: 'snapshot', blocked: [{ start: '2027-02-30', end: '2027-03-05' }], checkedAt }])) )]) {
      if (source !== null) await writeFile(path, source);
      const snapshot = await readAvailabilitySnapshot(path);
      for (const property of properties) assert.deepEqual(snapshot[property], { status: 'unavailable', blocked: [], checkedAt: null });
    }
  } finally { await rm(dir, { recursive: true, force: true }); }
});
