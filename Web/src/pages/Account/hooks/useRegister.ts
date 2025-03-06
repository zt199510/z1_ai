import { useState } from 'react';
import { message, notification } from 'antd';
import Verification from '@/apis/Verification';
import { AuthRegister } from '@/apis/Auth';
import { RegisterInput } from '@/types/Auth';
import { useNavigate } from 'react-router-dom';

interface RegisterValues {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  captcha: string;
}

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [codeImage, setCodeImage] = useState({
    code: '',
    id: ''
  });
  const navigate = useNavigate();

  // 生成随机验证码
  const generateCaptcha = async () => {
    try {
      const res = await Verification('register');
      if (res.success) {
        setCodeImage(res.data);
      } else {
        notification.error({
          message: '错误',
          description: res.message
        });
      }
    } catch (error) {
      notification.error({
        message: '错误',
        description: '验证码加载失败，请稍后重试'
      });
    }
  };

  // 注册方法
  const register = async (values: RegisterValues): Promise<boolean> => {
    setLoading(true);

    try {
      // 验证两次密码是否一致
      if (values.password !== values.confirmPassword) {
        message.error('两次输入的密码不一致');
        setLoading(false);
        return false;
      }

      // 构建注册请求参数
      const registerInput: RegisterInput = {
        userName: values.username,
        displayName: values.username,
        passwordHash: values.password,
        email: values.email,
        phone: null,
        code: values.captcha,
        codeId: codeImage.id
      };
      
      // 调用注册API
      const response = await AuthRegister(registerInput);
      
      if (response.success) {
        setLoading(false);
        message.success('注册成功');
        
        // 注册成功后跳转到登录页面
        setTimeout(() => {
          navigate('/auth/login');
        }, 1500);
        
        return true;
      } else {
        setLoading(false);
        message.error(response.message || '注册失败');
        generateCaptcha(); // 刷新验证码
        return false;
      }
    } catch (error) {
      console.error('注册出错:', error);
      message.error('注册过程中出现错误');
      generateCaptcha(); // 刷新验证码
      setLoading(false);
      return false;
    }
  };

  return {
    codeImage,
    loading,
    generateCaptcha,
    register
  };
};

export default useRegister; 