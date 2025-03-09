import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for the build files
  },
  server: {
    host: true, // Needed for Docker Container port mapping to work
    port: 5173, // You can replace this port with any port
    strictPort: true,
    watch: {
      usePolling: true, // Helps with dynamic detection of file changes
    },
  },
})
