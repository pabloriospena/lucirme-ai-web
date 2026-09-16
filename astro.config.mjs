import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import vercel from '@astrojs/vercel';
import { esES } from '@clerk/localizations'; // <--- 1. Importa esto

export default defineConfig({
  output: 'server',
  redirects: {
    '/whatsapp': 'https://wa.me/573053046180'
  },
  adapter: vercel(),
  integrations: [
    clerk({
      localization: esES // <--- 2. Inyecta la traducción global aquí
    })
  ],
  vite: {
    ssr: {
      noExternal: ['xlsx']
    }
  }
});