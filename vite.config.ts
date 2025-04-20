import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/socket-chat-app/",
  plugins: [react()],
  server: {
    allowedHosts: [
      "5f84-99-237-51-213.ngrok-free.app"
    ]
  }
})
