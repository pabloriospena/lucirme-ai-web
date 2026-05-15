import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';
import vercel from '@astrojs/vercel'; // <--- Esto es vital

export default defineConfig({
  output: 'server',
  adapter: vercel(), // <--- Esto le dice a Astro: "cuando hagas el build, prepárate para Vercel"
  integrations: [clerk()]
});