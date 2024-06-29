import { defineConfig } from 'vite'

import nunjucks from 'vite-plugin-nunjucks'

export default defineConfig({
  root: 'src',
  plugins: [nunjucks()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: { port: 3000 },
})
