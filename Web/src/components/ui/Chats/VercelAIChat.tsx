import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Space, 
  Divider,
  Spin,
  theme,
  InputRef
} from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  LoadingOutlined,
  SoundOutlined,
  CopyOutlined,
  CheckOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Paragraph, Title } = Typography;
const { useToken } = theme;

// 医疗主题颜色
const medicalColors = {
  primary: '#1976D2', // 医疗蓝
  secondary: '#E3F2FD', // 浅蓝色背景
  accent: '#03A9F4', // 强调色
  success: '#4CAF50', // 成功绿色
  border: '#BBDEFB', // 边框颜色
};

// 消息类型定义
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface VercelAIChatProps {
  messages?: Message[];
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  title?: string;
  userAvatar?: string;
  assistantAvatar?: string;
}

const VercelAIChat: React.FC<VercelAIChatProps> = ({
  messages = [],
  onSendMessage,
  isLoading = false,
  placeholder = '输入您的问题...',
  title = 'AI 助手',
  userAvatar,
  assistantAvatar
}) => {
  const { token } = useToken();
  const [inputValue, setInputValue] = useState('');
  const [isCopied, setIsCopied] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理发送消息
  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  // 处理按键事件
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 复制消息内容
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied({ ...isCopied, [id]: true });
      setTimeout(() => {
        setIsCopied({ ...isCopied, [id]: false });
      }, 2000);
    });
  };

  // 重新生成回答
  const regenerateResponse = () => {
    // 实现重新生成回答的逻辑
    console.log('重新生成回答');
  };

  // 文本转语音
  const textToSpeech = (text: string) => {
    // 实现文本转语音的逻辑
    console.log('文本转语音:', text);
  };

  // 消息动画变体
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <Card
      className="medical-theme vercel-ai-chat"
      style={{
        width: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        border: `1px solid ${token.colorBorderSecondary}`
      }}
      bodyStyle={{ padding: 0 }}
    >
      {/* 聊天标题 */}
      <div style={{ 
        padding: '16px 24px', 
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer
      }}>
        <Title level={4} style={{ margin: 0 }}>{title}</Title>
      </div>

      {/* 消息列表 */}
      <div style={{ 
        height: '500px', 
        overflowY: 'auto',
        padding: '16px 24px',
        background: token.colorBgContainer
      }}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            className={`vercel-ai-chat-message vercel-ai-chat-message-${message.role}`}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              {/* 头像 */}
              <Avatar
                size={40}
                icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                src={message.role === 'user' ? userAvatar : assistantAvatar}
                style={{
                  backgroundColor: message.role === 'user' 
                    ? medicalColors.accent 
                    : medicalColors.primary,
                  marginRight: '12px',
                  flexShrink: 0
                }}
              />

              {/* 消息内容 */}
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  {message.role === 'user' ? '您' : 'AI 助手'}
                </Text>
                <Paragraph
                  className="vercel-ai-chat-message-content"
                  style={{
                    margin: 0,
                    backgroundColor: message.role === 'user' 
                      ? token.colorBgTextHover 
                      : medicalColors.secondary,
                    color: token.colorText
                  }}
                >
                  {message.content}
                </Paragraph>

                {/* 消息操作按钮 - 仅对助手消息显示 */}
                {message.role === 'assistant' && (
                  <Space style={{ marginTop: '8px' }}>
                    <Button
                      type="text"
                      size="small"
                      icon={isCopied[message.id] ? <CheckOutlined /> : <CopyOutlined />}
                      onClick={() => copyToClipboard(message.content, message.id)}
                    >
                      {isCopied[message.id] ? '已复制' : '复制'}
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={<SoundOutlined />}
                      onClick={() => textToSpeech(message.content)}
                    >
                      朗读
                    </Button>
                  </Space>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* 加载中状态 */}
        {isLoading && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={messageVariants}
            className="vercel-ai-chat-message vercel-ai-chat-message-assistant"
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <Avatar
                size={40}
                icon={<RobotOutlined />}
                src={assistantAvatar}
                style={{
                  backgroundColor: medicalColors.primary,
                  marginRight: '12px'
                }}
              />
              <div style={{ flex: 1 }}>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  AI 助手
                </Text>
                <div
                  className="vercel-ai-chat-message-content"
                  style={{
                    backgroundColor: medicalColors.secondary,
                  }}
                >
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{ fontSize: 24, color: medicalColors.primary }}
                        spin
                      />
                    }
                  />
                  <Text style={{ marginLeft: '12px' }}>思考中...</Text>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 用于自动滚动的引用元素 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 重新生成按钮 - 仅在有消息且不在加载状态时显示 */}
      {messages.length > 0 && !isLoading && (
        <div style={{ 
          padding: '12px 24px', 
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          textAlign: 'center',
          background: token.colorBgContainer
        }}>
          <Button
            icon={<ReloadOutlined />}
            onClick={regenerateResponse}
            style={{ 
              borderColor: medicalColors.border,
              color: medicalColors.primary
            }}
          >
            重新生成回答
          </Button>
        </div>
      )}

      {/* 输入区域 */}
      <div style={{ 
        padding: '16px 24px', 
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        display: 'flex',
        alignItems: 'center'
      }}>
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="vercel-ai-chat-input"
          style={{ 
            flex: 1, 
            padding: '8px 12px',
            fontSize: '16px',
            borderColor: medicalColors.border
          }}
          disabled={isLoading}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          className="vercel-ai-chat-send-button"
          style={{ 
            marginLeft: '12px'
          }}
          disabled={!inputValue.trim() || isLoading}
        >
          发送
        </Button>
      </div>
    </Card>
  );
};

export default VercelAIChat; 