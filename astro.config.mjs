import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
/* import compress from "astro-compress"; */

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      name: "Audiowide",
      cssVariable: "--font-audiowide",
      provider: fontProviders.google(),
      styles: ["normal"]
    },
    {
      provider: fontProviders.local(),
      name: "CustomIcons",
      cssVariable: "--font-customicons", 
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/CustomFonts.woff"],
            display: "block"
          },
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/CustomFonts.woff2"],
            display: "block"
          }
        ]
      }
    },
  ],
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
  ]
})
