import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
/* import compress from "astro-compress"; */

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        jquery: '/node_modules/jquery'
      }
    }
  },
  integrations: [
    react()/*, 
    compress({
      css: false,
      html: true,
      img: true,
      js: true,
      image: true,
      svg: true,
    })
    */
  ],
  experimental: {
    csp: {
      styleDirective: {
        resources: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net"
        ]
      },
      scriptDirective: {
        resources: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-hashes'",
          "https://cdn.jsdelivr.net"
        ]
      },
      directives: [
        "default-src 'none'",
        "frame-src 'self' https://app.netlify.com/ https://codepen.io",
        "form-action 'self'",
        "base-uri 'self'",
        "manifest-src 'self'",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "object-src 'self'",
        "img-src 'self' data:",
        "media-src 'self'"
      ]
    }
  }
});
