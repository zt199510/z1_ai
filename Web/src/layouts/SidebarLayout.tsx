import { Outlet, useNavigate } from "react-router-dom";
import { Flexbox } from 'react-layout-kit';
import { useEffect } from "react";
import "../styles/main.css"; // 导入样式文件
export default function SidebarLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth/login')
    }

  }, [])

  return (
    <Flexbox style={{
      height: '100vh',
    }}
      horizontal
    >
      {/* <SideMenu /> */}
      <Outlet />
    </Flexbox>
  )
} 