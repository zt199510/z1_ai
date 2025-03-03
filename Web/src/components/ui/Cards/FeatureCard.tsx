import React, { ReactNode } from 'react';
import { Card, Typography } from 'antd';
import { motion } from 'framer-motion';

const { Title, Text } = Typography;

// 创建带动画效果的卡片组件
const MotionCard = motion(Card);

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  index?: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  color, 
  index = 0 
}) => {
  return (
    <MotionCard
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      hoverable
      style={{ height: '100%' }}
      bodyStyle={{
        textAlign: 'center',
        background: color,
        borderRadius: '8px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '32px 24px'
      }}
      whileHover={{ 
        scale: 1.03, 
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        transition: { duration: 0.3 }
      }}
    >
      <div style={{ marginBottom: 24 }}>{icon}</div>
      <Title level={4} style={{ marginBottom: 16 }}>{title}</Title>
      <Text type="secondary" style={{ fontSize: '14px' }}>{description}</Text>
    </MotionCard>
  );
};

export default FeatureCard; 