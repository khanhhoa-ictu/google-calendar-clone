import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "f681-2405-4802-1bd7-1860-1c09-22b5-c67-5642.ngrok-free.app"
    ]
  }
})
