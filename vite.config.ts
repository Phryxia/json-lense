import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': '/src',
    },
  },
  plugins: [react()],
  base: '/json-lense/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})
