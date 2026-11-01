import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import origins from './src/data/site-origins.json' with { type: 'json' };

export default defineConfig({
  site: origins.canonical,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react()],
  devToolbar: { enabled: false },
});
