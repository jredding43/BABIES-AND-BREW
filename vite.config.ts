import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/BABIES-AND-BREW/',
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", 
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
