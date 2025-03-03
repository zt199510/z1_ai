import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  Input, 
  Button, 
  Avatar, 
  Typography, 
  Space, 
  Spin,
  theme
} from 'antd';
import { 
  SendOutlined, 
  RobotOutlined, 
  UserOutlined,
  LoadingOutlined,
  SoundOutlined,
  CopyOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Text, Paragraph, Title } = Typography;
const { useToken } = theme;

// 消息类型定义
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}
import VercelAIChat from '../AIAssistant';


const Chat: React.FC = () => {
  return <VercelAIChat />;
};

export default Chat; 