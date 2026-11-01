import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ /* tu config pwa actual */ })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 👈 Agrega esto para solucionar el primer aviso
      },
    },
  },
});