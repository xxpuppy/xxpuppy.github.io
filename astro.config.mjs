// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://xxpuppy.github.io',
  output: 'static',
  integrations: [react()],
  markdown: {
    shikiConfig: {
      langs: ['javascript', 'php', 'sql', 'html', 'xml', 'shell', 'bash', 'python', 'json', 'yaml', 'plaintext', 'java', 'markdown']
    }
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // SCSS 配置
        }
      }
    }
  }
});
