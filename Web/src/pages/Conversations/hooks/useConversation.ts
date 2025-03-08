import { useState, useEffect } from 'react';

// 消息类型定义
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function useConversation(chatId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 加载对话消息
  useEffect(() => {
    if (!chatId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 请求特定ID的对话数据
        const response = await fetch(`http://localhost:9000/conversations?ID=${chatId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 假设返回的数据格式需要转换为我们的Message类型
        const formattedMessages: Message[] = data.messages?.map((msg: any) => ({
          id: msg.id || String(Date.now()),
          content: msg.content || '',
          role: msg.role || 'assistant',
          timestamp: new Date(msg.timestamp || Date.now())
        })) || [];
        
        setMessages(formattedMessages);
      } catch (err) {
        console.error('获取消息失败:', err);
        setError('获取消息失败，请稍后重试');
        
        // 如果API请求失败，使用模拟数据（仅用于开发）
        const mockMessages: Message[] = [
          {
            id: '1',
            content: '你好，有什么可以帮助你的吗？',
            role: 'assistant',
            timestamp: new Date(Date.now() - 60000 * 5)
          },
          {
            id: '2',
            content: '我想了解一下这个产品的功能。',
            role: 'user',
            timestamp: new Date(Date.now() - 60000 * 4)
          },
          {
            id: '3',
            content: '这是一个AI聊天应用，可以帮助你回答问题、提供信息和完成各种任务。你可以询问任何问题，我会尽力提供帮助。',
            role: 'assistant',
            timestamp: new Date(Date.now() - 60000 * 3)
          }
        ];
        
        setMessages(mockMessages);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [chatId]);
  
  // 发送消息并获取回复
  const sendMessage = async (content: string) => {
    if (!content.trim() || !chatId) return;
    
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
      // 发送消息到服务器
      const response = await fetch(`http://localhost:9000/conversations?ID=${chatId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          timestamp: new Date().toISOString()
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 假设服务器返回了助手的回复
      const assistantMessage: Message = {
        id: data.id || (Date.now() + 1).toString(),
        content: data.content || `这是对"${content}"的回复。在实际应用中，这里应该是从AI服务获取的回复内容。`,
        role: 'assistant',
        timestamp: new Date(data.timestamp || Date.now())
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('发送消息失败:', err);
      setError('发送消息失败，请稍后重试');
      
      // 如果API请求失败，使用模拟回复（仅用于开发）
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `这是对"${content}"的回复。在实际应用中，这里应该是从AI服务获取的回复内容。`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  // 清空对话历史
  const clearMessages = async () => {
    if (!chatId) return;
    
    setLoading(true);
    try {
      // 发送清空对话历史的请求
      const response = await fetch(`http://localhost:9000/conversations?ID=${chatId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setMessages([]);
    } catch (err) {
      console.error('清空对话历史失败:', err);
      setError('清空对话历史失败，请稍后重试');
      
      // 即使API请求失败，也清空本地消息（仅用于开发）
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages
  };
} 