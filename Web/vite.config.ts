import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import svgr from 'vite-plugin-svgr';

// 消息接口
interface ChatMessage {
  role: string;
  content: string;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9000,
    proxy: {
      '/api': 'http://localhost:5471/'
    }
  }
}); 