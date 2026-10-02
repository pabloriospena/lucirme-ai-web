import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import node from '@astrojs/node';
import vercel from '@astrojs/vercel';
import { esES } from '@clerk/localizations';

const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

export default defineConfig({
  output: 'server',
  redirects: {
    '/whatsapp': 'https://wa.me/573053046180'
  },
  adapter: isVercel ? vercel() : node({ mode: 'standalone' }),
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  integrations: [
    clerk({
      localization: esES
    })
  ],
  devToolbar: {
    enabled: false
  },
  vite: {
    ssr: {
      noExternal: ['xlsx']
    }
  }
});