import type { APIRoute } from 'astro';
import { getAvailability, isAvailabilityProperty, type AvailabilityResponse } from '../../lib/availability.server';

export const prerender = false;

function json(body: AvailabilityResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export const GET: APIRoute = async ({ url }) => {
  const property = url.searchParams.get('property') ?? '';
  if (!isAvailabilityProperty(property)) {
    return json({
      status: 'unavailable', blocked: [], checkedAt: null,
      message: 'Choose an apartment to check availability.',
    }, 400);
  }
  return json(await getAvailability(property));
};
