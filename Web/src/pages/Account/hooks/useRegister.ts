import { useState } from 'react';
import { message, notification } from 'antd';
import Verification from '../../../apis/Verification';

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

      // 验证验证码


      // 模拟注册请求
      // 在实际应用中，这里应该调用API进行注册
      return await new Promise((resolve) => {
        setTimeout(() => {
          // 调用auth中的register方法
          setLoading(false);
        }, 1500);
      });
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