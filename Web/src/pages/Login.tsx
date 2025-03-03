import React, { useState } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  message,
  Space
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();

  // 如果已经登录，重定向到首页
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/chat');
    }
  }, [isLoggedIn, navigate]);

  // 处理登录
  const handleLogin = (values: { email: string; password: string }) => {
    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      const success = login(values.email, values.password);
      
      if (success) {
        message.success('登录成功');
        navigate('/chat');
      } else {
        message.error('登录失败，请检查邮箱和密码');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '50px 20px'
      }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: 400,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            borderRadius: 8
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>登录</Title>
            <Text type="secondary">登录您的账户以继续</Text>
          </div>
          
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={handleLogin}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: '请输入您的邮箱' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="邮箱" 
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入您的密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="密码" 
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large" 
                block
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          
          <Space style={{ width: '100%', justifyContent: 'center' }}>
            <Button type="link">忘记密码?</Button>
            <Button type="link" onClick={() => navigate('/register')}>
              注册新账户
            </Button>
          </Space>
          
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Text type="secondary">
              提示: 输入任意邮箱和密码即可登录 (演示模式)
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
} 