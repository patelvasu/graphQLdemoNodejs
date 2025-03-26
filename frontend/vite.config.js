import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import postcss from "@tailwindcss/postcss";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), postcss()],
  server: {
    host: true, // Listen on all local IPs
    port: 3000, // Specify the port number
  },
})
