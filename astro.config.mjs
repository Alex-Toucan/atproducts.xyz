import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        jquery: '/node_modules/jquery'
      }
    }
  },
  integrations: [
    react()
  ],
  adapter: netlify()
});