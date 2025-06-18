/**
 * @file vite.config.js
 * @path ./taxbuddy-chat-demo/vite.config.js
 * @version 1.0.0
 * @lastModified 2025-06-17
 * @changeLog
 * - v1.0.0 (2025-06-17): Initial creation with path aliases
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@services': resolve(__dirname, './src/services'),
      '@config': resolve(__dirname, './src/config'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@styles': resolve(__dirname, './src/styles'),
      '@assets': resolve(__dirname, './src/assets'),
      '@data': resolve(__dirname, './src/data'),
    }
  },
  server: {
    port: parseInt(process.env.VITE_DEV_PORT) || 5173,
    host: process.env.VITE_DEV_HOST || 'localhost',
    open: process.env.VITE_AUTO_OPEN === 'true'
  },
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development'
  }
})