import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Card,
  Descriptions,
  Button,
  Tabs,
  message,
  Skeleton,
  Form,
  Input,
  Upload,
  Modal
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EditOutlined,
  LockOutlined,
  UploadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TabsProps } from 'antd';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

interface UserData {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  lastLogin?: string;
  role?: string;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    // 模拟从API获取用户数据
    // 实际项目中应该替换为真实的API调用
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // 这里应该是实际的API调用
        // const response = await fetch('/api/user/profile');
        // const data = await response.json();

        // 模拟数据
        const mockData: UserData = {
          id: '1',
          name: '测试用户',
          email: 'user@example.com',
          phone: '13800138000',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
          createdAt: '2023-01-01',
          lastLogin: '2023-03-15',
          role: '普通用户'
        };

        setTimeout(() => {
          setUserData(mockData);
          setLoading(false);

          // 预填充表单
          form.setFieldsValue({
            name: mockData.name,
            email: mockData.email,
            phone: mockData.phone,
          });

          // 如果有头像，添加到文件列表
          if (mockData.avatar) {
            setFileList([
              {
                uid: '-1',
                name: 'avatar.png',
                status: 'done',
                url: mockData.avatar,
              },
            ]);
          }
        }, 1000);
      } catch (error) {
        console.error('获取用户数据失败:', error);
        message.error('获取用户信息失败');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [form]);

  const handleEditProfile = () => {
    setIsEditModalVisible(true);
  };

  const handleChangePassword = () => {
    setIsPasswordModalVisible(true);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      // 这里应该是实际的API调用
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });

      // 模拟API调用
      console.log('提交的表单数据:', values);

      // 更新本地状态
      if (userData) {
        setUserData({
          ...userData,
          name: values.name,
          email: values.email,
          phone: values.phone,
        });
      }

      message.success('个人资料更新成功');
      setIsEditModalVisible(false);
    } catch (error) {
      console.error('更新个人资料失败:', error);
      message.error('更新个人资料失败');
    }
  };

  const handlePasswordSubmit = async (values: any) => {
    try {
      // 这里应该是实际的API调用
      // const response = await fetch('/api/user/change-password', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(values),
      // });

      // 模拟API调用
      console.log('提交的密码数据:', values);

      message.success('密码修改成功');
      setIsPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error) {
      console.error('修改密码失败:', error);
      message.error('修改密码失败');
    }
  };

  const uploadProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // 检查文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件!');
        return Upload.LIST_IGNORE;
      }

      // 检查文件大小
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片必须小于2MB!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '个人资料',
      children: (
        <Card>
          {loading ? (
            <Skeleton avatar paragraph={{ rows: 4 }} active />
          ) : (
            <Descriptions bordered column={1}>
              <Descriptions.Item label="用户ID">{userData?.id}</Descriptions.Item>
              <Descriptions.Item label="用户名">{userData?.name}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{userData?.email}</Descriptions.Item>
              <Descriptions.Item label="手机号">{userData?.phone || '未设置'}</Descriptions.Item>
              <Descriptions.Item label="注册时间">{userData?.createdAt}</Descriptions.Item>
              <Descriptions.Item label="最后登录">{userData?.lastLogin}</Descriptions.Item>
              <Descriptions.Item label="用户角色">{userData?.role}</Descriptions.Item>
            </Descriptions>
          )}

          <div className="flex justify-end mt-4 space-x-2">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={handleEditProfile}
              disabled={loading}
            >
              编辑资料
            </Button>
            <Button
              icon={<LockOutlined />}
              onClick={handleChangePassword}
              disabled={loading}
            >
              修改密码
            </Button>
          </div>
        </Card>
      ),
    },
    {
      key: '2',
      label: '安全设置',
      children: (
        <Card>
          <p>此处可以添加安全设置相关内容，如：</p>
          <ul className="list-disc pl-5 mt-2">
            <li>两步验证</li>
            <li>登录历史</li>
            <li>设备管理</li>
            <li>应用授权</li>
          </ul>
        </Card>
      ),
    },
    {
      key: '3',
      label: '通知设置',
      children: (
        <Card>
          <p>此处可以添加通知设置相关内容，如：</p>
          <ul className="list-disc pl-5 mt-2">
            <li>邮件通知</li>
            <li>系统通知</li>
            <li>消息提醒</li>
          </ul>
        </Card>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Card className="text-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <Skeleton.Avatar active size={100} shape="circle" />
                <Skeleton active paragraph={{ rows: 1 }} />
              </div>
            ) : (
              <>
                <Avatar
                  size={100}
                  src={userData?.avatar}
                  icon={!userData?.avatar && <UserOutlined />}
                />
                <h2 className="mt-4 text-xl font-bold">{userData?.name}</h2>
                <p className="text-gray-500">{userData?.email}</p>
                {userData?.phone && (
                  <p className="text-gray-500">
                    <PhoneOutlined className="mr-1" />
                    {userData.phone}
                  </p>
                )}
              </>
            )}
          </Card>
        </div>

        <div className="md:w-3/4">
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </div>

      {/* 编辑个人资料模态框 */}
      <Modal
        title="编辑个人资料"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            label="头像"
            name="avatar"
          >
            <Upload {...uploadProps} listType="picture">
              <Button icon={<UploadOutlined />}>上传头像</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="用户名"
            name="name"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={[
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="手机号" />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="default" className="mr-2" onClick={() => setIsEditModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        open={isPasswordModalVisible}
        onCancel={() => setIsPasswordModalVisible(false)}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: true, message: '请输入当前密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 8, message: '密码长度不能少于8个字符' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Button type="default" className="mr-2" onClick={() => setIsPasswordModalVisible(false)}>
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              确认修改
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserProfile; 