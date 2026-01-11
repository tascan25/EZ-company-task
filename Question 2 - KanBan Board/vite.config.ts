import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    // This tells Vite to skip type checking during build
    emptyOutDir: true,
  },
  esbuild: {
    // Ignore TS errors
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})
