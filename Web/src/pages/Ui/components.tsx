import React from 'react';
import { Layout, Typography, Divider, Space, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function ComponentsPage() {
  const navigate = useNavigate();

  return (
    <Layout style={{ background: '#fff' }}>
      <Content style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/')}
          style={{ marginBottom: 24 }}
        >
          返回首页
        </Button>
        
        <Title level={1}>组件库</Title>
        <Paragraph>这是组件库展示页面，您可以在这里查看和使用各种组件。</Paragraph>
        
        <Divider />
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>按钮组件</Title>
            <Space wrap>
              <Button type="primary">主要按钮</Button>
              <Button>默认按钮</Button>
              <Button type="dashed">虚线按钮</Button>
              <Button type="link">链接按钮</Button>
            </Space>
          </div>
          
          <div>
            <Title level={2}>更多组件</Title>
            <Paragraph>
              这里可以展示更多的组件示例...
            </Paragraph>
          </div>
        </Space>
      </Content>
    </Layout>
  );
} 