import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Root-level GitHub Pages site (Driss0624.github.io), so assets resolve from '/'.
  base: '/',
  plugins: [react()],
})
