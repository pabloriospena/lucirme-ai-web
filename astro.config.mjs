import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import node from '@astrojs/node';
import { esES } from '@clerk/localizations';

export default defineConfig({
  output: 'server',
  redirects: {
    '/whatsapp': 'https://wa.me/573053046180'
  },
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  integrations: [
    clerk({
      localization: esES
    })
  ],
  vite: {
    ssr: {
      noExternal: ['xlsx']
    }
  }
});