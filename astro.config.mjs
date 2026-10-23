import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

export default defineConfig({
  site: process.env.SITE_URL || 'https://the-title-v.github.io',
  output: 'static',
  trailingSlash: 'always',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  devToolbar: { enabled: false },
});
