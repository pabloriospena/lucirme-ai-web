import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [clerk()],
  vite: {
    css: {
      postcss: './postcss.config.mjs',
    }
  }
});