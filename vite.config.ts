import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://book-my-radiant-qq6mlefg7-deeptimaank.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
