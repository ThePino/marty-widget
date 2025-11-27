import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

console.log("🔹 Vite Root Directory:", __dirname); // Debug: controlliamo dove sta guardando

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  
  // FIX CRITICO: Diciamo esplicitamente che la root è QUESTA cartella
  root: __dirname,
  
  base: command === 'serve' ? '/' : './', 
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // AGGIUNTA QUI: Mappa @my-electron alla cartella electron nella root
      '@my-electron': path.resolve(__dirname, 'electron'),
    },
  },
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  
  server: {
    port: 5173,
    strictPort: true,
    host: '0.0.0.0', // Fondamentale per Docker
    
    // FIX EXTRA: Se per qualche motivo Vite serve 404, questo aiuta a capire cosa sta servendo
    fs: {
      strict: false,
      allow: ['..']
    }
  }
}));