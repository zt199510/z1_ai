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

  // 社区项目
  const communityProjects = [
    {
      id: '1',
      title: 'AI Chat Interface',
      description: 'AI 聊天界面',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: '2',
      title: 'Portfolio',
      description: '投资组合',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: '3',
      title: 'Hoodie Store',
      description: '卫衣商店',
      image: 'https://via.placeholder.com/300x200',
    },
    {
      id: '4',
      title: 'AI Card Generation',
      description: 'AI 卡片生成',
      image: 'https://via.placeholder.com/300x200',
    }
  ];

  return (
    <Layout style={{ background: '#fff', height: '100vh' }}>
      <Content style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Title level={1} style={{ fontSize: 48, marginBottom: 16 }}>
            What can I help you ship?
          </Title>
          <Title level={2} style={{ fontWeight: 'normal', marginTop: 0 }}>
            我能帮您运送什么？
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
                <Tag color="blue">Need more messages? Get higher limits with Premium.</Tag>
                <Button type="link" size="small">Upgrade Plan 升级计划</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 快捷操作按钮 */}
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <Space size="large" wrap>
            <Button icon={<CopyOutlined />} size="large">
              Clone a Screenshot 克隆屏幕截图
            </Button>
            <Button icon={<ImportOutlined />} size="large">
              Import from Figma 从Figma导入
            </Button>
            <Button icon={<UploadOutlined />} size="large">
              Upload a Project 上传项目
            </Button>
          </Space>
        </div>

        {/* 项目类型选择 */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Space size="large" wrap style={{ justifyContent: 'center' }}>
            {projectItems.map((item, index) => (
              <Card 
                key={index}
                hoverable
                style={{ width: 200, textAlign: 'center', borderRadius: 8 }}
                bodyStyle={{ padding: '20px 16px' }}
              >
                <Space direction="vertical" size="small">
                  {item.icon}
                  <Text strong>{item.title}</Text>
                  <Text type="secondary">{item.description}</Text>
                </Space>
              </Card>
            ))}
          </Space>
        </div>

    
      </Content>
    </Layout>
  );
} 