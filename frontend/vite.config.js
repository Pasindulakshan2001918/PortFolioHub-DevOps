import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: '0.0.0.0',        // bind to all interfaces
    port: 5173,
    strictPort: true,        // fail if 5173 is taken
    watch: {
      usePolling: true,
    },
    hmr: {
      host: 'localhost',     // ensures hot reload works from host
    },
  }
})
