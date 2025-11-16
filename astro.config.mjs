import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [
    react(),
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
        "default-src 'self'",
        "frame-src 'self' https://app.netlify.com/ https://codepen.io https://javaspence.github.io/",
        "form-action 'self'",
        "base-uri 'self'",
        "manifest-src 'self'",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "object-src 'self'",
        "img-src 'self' data:"
      ]
    }
  }
});
