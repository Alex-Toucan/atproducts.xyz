import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        jquery: '/node_modules/jquery'
      }
    }
  },
  integrations: [
    react(),
  ],
});