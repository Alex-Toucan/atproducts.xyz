import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/devicon/fonts/*',
          dest: '_astro'
        }
      ]
    })
  ],
  adapter: netlify(),
});
