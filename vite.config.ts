import { defineConfig } from 'vite'

import nunjucks from 'vite-plugin-nunjucks'

export default defineConfig({
  root: 'src',
  plugins: [nunjucks()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        index: 'src/index.html',
        signIn: 'src/sign-in.html',
        // ...
        // List all files you want in your build
      },
    },
  },
  server: { port: 3000 },
})
