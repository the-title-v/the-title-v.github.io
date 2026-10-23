import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { AVAILABILITY_PROPERTIES } from '../../src/lib/availability-policy';
import { mergeBlockedRanges } from '../../src/lib/calendar';
import type { ClientAvailability } from '../../src/lib/availability-client';
import type { AvailabilityResponse } from './calendar-source';

type Snapshot = Record<string, ClientAvailability>;
const empty = (): ClientAvailability => ({ status: 'unavailable', blocked: [], checkedAt: null });

function sanitize(value: unknown): ClientAvailability {
  if (!value || typeof value !== 'object') throw new Error('Invalid snapshot');
  const item = value as ClientAvailability;
  if (!['snapshot', 'unavailable'].includes(item.status) || !Array.isArray(item.blocked)) throw new Error('Invalid snapshot');
  const blocked = mergeBlockedRanges(item.blocked.map(({ start, end }) => ({ start, end })));
  if (item.status === 'unavailable') return { status: 'unavailable', blocked, checkedAt: null };
  if (typeof item.checkedAt !== 'string' || !Number.isFinite(Date.parse(item.checkedAt)) || new Date(item.checkedAt).toISOString() !== item.checkedAt) throw new Error('Invalid snapshot');
  return { status: 'snapshot', blocked, checkedAt: item.checkedAt };
}

export async function writeAvailabilitySnapshot(path: string, getAvailability: (property: string) => Promise<AvailabilityResponse>): Promise<void> {
  const values = await Promise.all(AVAILABILITY_PROPERTIES.map(async property => {
    const response = await getAvailability(property);
    // Leave the last deployed calendar intact when either feed fails.
    if (response.status !== 'live') throw new Error('Calendar import incomplete; previous published dates are preserved.');
    return [property, sanitize({ ...response, status: 'snapshot' })] as const;
  }));
  await mkdir(dirname(path), { recursive: true });
  await writeFile(`${path}.tmp`, `${JSON.stringify(Object.fromEntries(values), null, 2)}\n`);
  await rename(`${path}.tmp`, path);
}

export async function readAvailabilitySnapshot(path: string): Promise<Snapshot> {
  try {
    const value = JSON.parse(await readFile(path, 'utf8'));
    return Object.fromEntries(AVAILABILITY_PROPERTIES.map(property => [property, sanitize(value[property])]));
  } catch {
    return Object.fromEntries(AVAILABILITY_PROPERTIES.map(property => [property, empty()]));
  }
}
