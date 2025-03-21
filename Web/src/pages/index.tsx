import React, { useState } from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  Typography, 
  Space, 
  Card, 
  Row, 
  Col, 
  Divider,
  Tag
} from 'antd';
import { 
  SendOutlined, 
  PlusOutlined, 
  UploadOutlined, 
  ImportOutlined,
  CopyOutlined,
  FormOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ChatPage() {
  const [message, setMessage] = useState('');

  // 示例项目
  const projectItems = [
    {
      title: 'Landing Page',
      description: '登陆页面',
      icon: <CopyOutlined />,
    },
    {
      title: 'Sign Up Form',
      description: '注册表格',
      icon: <FormOutlined />,
    }
  ];
  return (
    <Layout style={{ background: '#fff', height: '95vh' }}>
      <Content style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1} style={{ fontSize: 48, marginBottom: 16 }}>
            What can I help you ship?
          </Title>
        
        </div>

        {/* 消息输入区域 */}
        <div style={{ maxWidth: 800, margin: '0 auto 60px' }}>
          <Card
            style={{ 
              borderRadius: 8, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              background: '#f9f9f9'
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <div style={{ position: 'relative' }}>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask v0 a question..."
                autoSize={{ minRows: 1, maxRows: 6 }}
                style={{ 
                  padding: '12px 16px', 
                  paddingRight: '50px',
                  borderRadius: 8,
                  resize: 'none',
                  fontSize: 16
                }}
              />
              <Button 
                type="primary" 
                shape="circle" 
                icon={<SendOutlined />} 
                style={{ 
                  position: 'absolute', 
                  right: 16, 
                  top: '50%', 
                  transform: 'translateY(-50%)' 
                }}
              />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: 16,
              alignItems: 'center'
            }}>
              <div>
                <Button 
                  type="text" 
                  icon={<PlusOutlined />} 
                  style={{ marginRight: 8 }}
                >
                  Project 项目
                </Button>
              </div>
              <div>
              
              </div>
            </div>
          </Card>
        </div>

       
      </Content>
    </Layout>
  );
} 