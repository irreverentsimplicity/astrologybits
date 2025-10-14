import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://astrologybits.com',
  integrations: [
    sitemap({
      filter: (page) => 
        !page.includes('/wp-admin') && 
        !page.includes('/wp-json'),
    })
  ],
  output: 'static',
});