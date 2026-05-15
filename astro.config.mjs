import { defineConfig } from 'astro/config';
import clerk from '@clerk/astro';

export default defineConfig({
  integrations: [clerk()],
  output: 'server' // <--- AÑADE ESTA LÍNEA SI NO ESTÁ
});