import { useState } from 'react';
import { message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthLogin } from '@/apis/Auth';
import { LoginInput } from '@/types/Auth';
import { getCurrentUser } from '@/apis/User';
import Verification from '@/apis/Verification';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [codeImage, setCodeImage] = useState({
    code: '',
    id: ''
  });

  /**
   * 生成验证码
   */
  const generateCaptcha = async () => {
    try {
      const res = await Verification('login');
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

  /**
   * 处理用户登录
   * @param values 登录表单值
   * @returns 登录是否成功
   */
  const login = async (values: { email: string; password: string; code?: string; remember?: boolean }): Promise<boolean> => {
    setLoading(true);

    try {
      // 构建登录请求参数
      const loginInput: LoginInput = {
        userName: values.email,
        password: values.password,
        code: values.code || codeImage.code,
        codeId: codeImage.id,
        remember: values.remember || false
      };

      // 调用登录API
      const response = await AuthLogin(loginInput);

      if (response.success) {
        setLoading(false);
        message.success('登录成功');

        // 保存token信息
        if (response.data != null) {
          localStorage.setItem('token', response.data);

          // 保存用户信息
          const user = await getCurrentUser();
          if (user.success) {
            localStorage.setItem('user', JSON.stringify(user.data));
          }

        }
        // 登录成功后跳转到仪表盘
        navigate('/');
        return true;
      } else {
        setLoading(false);
        message.error(response.message || '登录失败');
        // 刷新验证码
        generateCaptcha();
        return false;
      }
    } catch (error) {
      console.error('登录出错:', error);
      message.error('登录过程中出现错误');
      setLoading(false);
      // 刷新验证码
      generateCaptcha();
      return false;
    }
  };

  /**
   * 跳转到注册页面
   */
  const goToRegister = () => {
    navigate('/auth/register');
  };

  /**
   * 跳转到忘记密码页面
   */
  const goToForgotPassword = () => {
    navigate('/auth/forgot-password');
  };

  return {
    loading,
    codeImage,
    generateCaptcha,
    login,
    goToRegister,
    goToForgotPassword
  };
};

export default useLogin; 