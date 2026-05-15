import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  base: '/tali-demo/' // ⚠️ MUST MATCH YOUR REPO NAME
})
