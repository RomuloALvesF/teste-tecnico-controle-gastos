import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração do Vite build e servidor de desenvolvimento.
export default defineConfig({
  plugins: [react()],
})
