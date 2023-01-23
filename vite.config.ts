import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {global: 'window'},
  logLevel: 'warn',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 4200
  }
})
