import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import Info from 'unplugin-info/vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@src': '/src',
    },
  },
  plugins: [react(), Info()],
  base: '/json-lense/',
})
