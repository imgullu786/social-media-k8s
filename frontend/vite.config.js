import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3000,
    proxy: {
      '/api':{
        // target: 'http://localhost:5000', for localhost
        
        // as docker-compose uses the service name as the hostname
        // target: "http://node-app:5000",  for docker compose

        // as k8s uses the service name as the hostname
        target: "http://backend:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  }
})
