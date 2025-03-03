import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import VercelAIChat, { Message } from './VercelAIChat';
import { Card, Typography } from 'antd';

const { Title } = Typography;

// 模拟 AI 响应
const simulateAIResponse = (userMessage: string): Promise<string> => {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      const responses = [
        `感谢您的问题。关于"${userMessage}"，我可以提供以下信息...\n\n医学研究表明，保持健康的生活方式对预防疾病非常重要。建议每天保持适量运动、均衡饮食、充足睡眠，并定期进行健康检查。`,
        `您询问的"${userMessage}"是一个很好的问题。\n\n根据最新的医学指南，我们建议患者在医生的指导下使用药物，并遵循处方说明。如果您有任何不适，请立即咨询您的医生。`,
        `关于"${userMessage}"，我想分享一些重要信息。\n\n现代医学强调预防保健的重要性。通过健康的生活习惯和定期体检，可以早期发现潜在的健康问题，及时干预治疗。`,
        `您好！关于"${userMessage}"，以下是一些专业建议：\n\n1. 咨询专业医生\n2. 遵循治疗方案\n3. 保持健康生活方式\n4. 定期复查\n\n希望这些信息对您有所帮助。`
      ];
      
      // 随机选择一个响应
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      resolve(randomResponse);
    }, 1500); // 1.5秒延迟
  });
};

const ChatExample: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 初始化欢迎消息
  useEffect(() => {
    const welcomeMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: '您好！我是您的医疗AI助手。我可以回答您关于健康和医疗的问题，提供专业的医疗建议，或者帮助您了解各种疾病和治疗方法。请问有什么我可以帮助您的吗？',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  // 处理发送消息
  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // 模拟 AI 响应
      const aiResponse = await simulateAIResponse(content);
      
      // 添加 AI 响应
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('获取 AI 响应时出错:', error);
      
      // 添加错误消息
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '抱歉，我在处理您的请求时遇到了问题。请稍后再试。',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        医疗 AI 助手
      </Title>
      
      <VercelAIChat
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="请输入您的健康问题..."
        title="医疗咨询"
      />
      
      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Typography.Text type="secondary">
          注意：这是一个演示应用，不提供真实的医疗建议。如有健康问题，请咨询专业医生。
        </Typography.Text>
      </div>
    </div>
  );
};

export default ChatExample; 