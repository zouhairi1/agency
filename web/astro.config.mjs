// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { loadEnv } from 'vite';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import glsl from 'vite-plugin-glsl';

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const pbUrl = new URL(env.PUBLIC_PB_URL || 'http://127.0.0.1:8090');

// https://astro.build/config
export default defineConfig({
  site: env.SITE_URL || 'https://example.com',
  output: 'static',

  // French (Morocco) by default at "/", English at "/en/".
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    routing: { prefixDefaultLocale: false },
  },

  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-MA', en: 'en' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],

  // Instant navigations: prefetch links on hover/focus.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  // Allow build-time optimisation of images stored in PocketBase.
  image: {
    remotePatterns: [{ protocol: pbUrl.protocol.replace(':', ''), hostname: pbUrl.hostname }],
  },

  fonts: [
    {
      provider: fontProviders.fontshare(),
      name: 'General Sans',
      cssVariable: '--font-general-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: [400, 500],
      styles: ['normal'],
    },
  ],

  vite: {
    plugins: [tailwindcss(), glsl({ minify: true })],
  },
});
