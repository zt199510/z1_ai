import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// 模拟响应生成器
function generateMockResponse(prompt: string): string {
  const responses = [
    `感谢您的问题。关于"${prompt}"，我可以提供以下信息...\n\n根据最新研究，这个领域有很多新的发展。首先，我们需要理解基本概念，然后再深入探讨具体应用。`,
    `您询问的"${prompt}"是一个很好的问题。\n\n从技术角度来看，这涉及到多个方面的知识。让我为您详细解释一下核心原理和实际应用场景。`,
    `关于"${prompt}"，我想分享一些重要信息。\n\n这是一个复杂的话题，但我会尽量简明扼要地解释。首先，我们需要了解基本框架，然后再讨论具体实现细节。`,
    `您好！关于"${prompt}"，以下是一些专业建议：\n\n1. 理解基本原理\n2. 学习实际应用\n3. 掌握核心技能\n4. 持续学习和实践\n\n希望这些信息对您有所帮助。`
  ];
  
  // 随机选择一个响应
  const response = responses[Math.floor(Math.random() * responses.length)];
  return response;
}

// 消息接口
interface ChatMessage {
  role: string;
  content: string;
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}); 