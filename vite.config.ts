import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  plugins: [],
  build: {
    outDir: '../dist',
    emptyOutDir: true,

    rollupOptions: {
      input: {
        the404page: 'src/404.html',
        index: 'src/index.html',
        protected: 'src/protected.html',
        signIn: 'src/auth/sign-in.html',
        awaitCode: 'src/auth/await-code.html',
        // ...
        // List all files you want in your build
      },
    },
  },
  server: { port: 3000 },
})
