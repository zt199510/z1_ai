import { useState } from 'react';

// 消息类型定义
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 发送消息并获取回复
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    
    try {
      // 这里应该调用实际的API获取回复
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 模拟助手回复
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `这是对"${content}"的回复。在实际应用中，这里应该是从AI服务获取的回复内容。`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // 清空对话历史
  const clearMessages = () => {
    setMessages([]);
  };
  
  return {
    messages,
    loading,
    sendMessage,
    clearMessages
  };
} 