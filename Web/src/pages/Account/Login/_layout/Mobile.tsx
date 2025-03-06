import React, { useEffect } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Card, 
  Space,
  Checkbox,
  Row,
  Col
} from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import useLogin from '../../hooks/useLogin';
const { Content } = Layout;
const { Title, Text } = Typography;

export default function Mobile() {
  const { loading, codeImage, generateCaptcha, login, goToRegister, goToForgotPassword } = useLogin();
  
  // 组件挂载时生成验证码
  useEffect(() => {
    generateCaptcha();
  }, []);
  
  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px 16px'
      }}>
        <Card 
          style={{ 
            width: '100%',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            borderRadius: 8
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3} style={{ marginBottom: 8 }}>登录</Title>
            <Text type="secondary">登录您的账户以继续</Text>
          </div>
          
          <Form
            name="login-mobile"
            initialValues={{ remember: true }}
            onFinish={login}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: '请输入您的邮箱' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="邮箱" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入您的密码' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="密码" 
              />
            </Form.Item>
            
            <Form.Item
              name="code"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Row gutter={8}>
                <Col span={15}>
                  <Input 
                    prefix={<SafetyOutlined />} 
                    placeholder="验证码" 
                  />
                </Col>
                <Col span={9}>
                  <div 
                    onClick={generateCaptcha}
                    style={{ 
                      height: '40px', 
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '1px solid #d9d9d9',
                      borderRadius: '2px'
                    }}
                  >
                    {codeImage.code ? (
                      <img 
                        src={`data:image/png;base64,${codeImage.code}`} 
                        alt="验证码" 
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                      />
                    ) : (
                      <Text type="secondary" style={{ fontSize: '12px' }}>加载中...</Text>
                    )}
                  </div>
                </Col>
              </Row>
            </Form.Item>
            
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                loading={loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
          
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button type="link" size="small" onClick={goToForgotPassword}>忘记密码?</Button>
            <Button type="link" size="small" onClick={goToRegister}>
              注册新账户
            </Button>
          </Space>
          
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              提示: 输入正确的账号密码和验证码进行登录
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
} 