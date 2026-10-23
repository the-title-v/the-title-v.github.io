import type { APIRoute } from 'astro';
import { resolve } from 'node:path';
import { readAvailabilitySnapshot } from '../../../scripts/lib/availability-snapshot';

export const prerender = true;

export async function getStaticPaths() {
  const snapshot = await readAvailabilitySnapshot(resolve('.cache/availability.json'));
  return Object.entries(snapshot).map(([property, availability]) => ({ params: { property }, props: { availability } }));
}

export const GET: APIRoute = ({ props }) => new Response(JSON.stringify(props.availability), {
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
});
