import React, { useEffect } from 'react';
import {
  Layout,
  Form,
  Input,
  Button,
  Typography,
  Card,
  Space,
  Divider,
  Row,
  Col
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../../hooks/useRegister';

const { Content } = Layout;
const { Title, Text } = Typography;

// 密码验证规则
const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码长度不能少于6个字符' }
];

export default function Desktop() {
  const navigate = useNavigate();
  const { loading, codeImage, generateCaptcha, register } = useRegister();
  const [form] = Form.useForm();
  // 处理注册
  const handleRegister = async (values: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    captcha: string;
  }) => {
    const success = await register(values);
    if (success) {
      navigate('/chat');
    }
  };


  useEffect(() => {
    generateCaptcha();
  }, []);
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
            <Title level={2} style={{ marginBottom: 8 }}>注册账户</Title>
            <Text type="secondary">创建您的账户以开始使用</Text>
          </div>

          <Form
            form={form}
            name="register"
            initialValues={{ remember: true }}
            onFinish={handleRegister}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: '请输入您的邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="邮箱"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入您的用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={passwordRules}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                ...passwordRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="captcha"
              rules={[{ required: true, message: '请输入验证码' }]}
            >
              <Row gutter={8}>
                <Col span={14}>
                  <Input
                    prefix={<SafetyOutlined />}
                    placeholder="验证码"
                    size="large"
                  />
                </Col>
                <Col span={10}>
                  <div style={{
                    display: 'flex',
                    height: '40px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '40px',
                      border: '1px solid #d9d9d9',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      cursor: 'pointer'
                    }}>
                      <img
                        src={codeImage.code}
                        alt="验证码"
                        style={{ width: '100%', height: '100%', display: 'block' }}
                      />
                    </div>
                    <Button
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={generateCaptcha}
                      style={{
                        marginLeft: 4,
                        height: '40px'
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                注册
              </Button>
            </Form.Item>
          </Form>

          <Divider plain>
            <Text type="secondary">已有账户?</Text>
          </Divider>

          <Button
            type="default"
            block
            onClick={() => navigate('/auth/login')}
            style={{ marginBottom: 16 }}
          >
            登录现有账户
          </Button>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Text type="secondary">
              提示: 注册功能目前处于演示模式，不会真正创建账户
            </Text>
          </div>
        </Card>
      </Content>
    </Layout>
  );
} 