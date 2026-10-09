import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/auth': 'http://127.0.0.1:8001',
      '/users': 'http://127.0.0.1:8002',
      '/groups': 'http://127.0.0.1:8003',
    },
  },
})
