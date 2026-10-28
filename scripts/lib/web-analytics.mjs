import assert from 'node:assert/strict';
import { webAnalyticsLoader } from '../../src/lib/web-analytics.ts';

export function verifyWebAnalyticsHtml(html, analytics, path) {
  const loaders = [...html.matchAll(/<script\b[^>]*\bdata-web-analytics(?=[\s=>])[^>]*>([\s\S]*?)<\/script>/g)];
  const beacons = html.split('https://static.cloudflareinsights.com/beacon.min.js').length - 1;
  const expectedCount = analytics ? 1 : 0;
  assert(loaders.length === expectedCount && beacons === expectedCount, `Unexpected analytics loader count: ${path}`);
  if (analytics) {
    // The shared layout puts this inline classic script after the head's charset.
    // Anchoring to the document prefix excludes comments and inactive containers.
    const executableLoader = html.match(/^\s*<!doctype html>\s*<html\b[^>]*>\s*<head>\s*<meta charset="UTF-8"\s*\/?>\s*<script data-web-analytics>([\s\S]*?)<\/script>/i);
    assert(executableLoader && executableLoader[1] === webAnalyticsLoader(analytics), `Incorrect analytics registration, runtime guard or executable placement: ${path}`);
    assert(html.split(analytics.token).length - 1 === 1, `Unexpected analytics token count: ${path}`);
  }
}
