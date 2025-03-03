import React, { ReactNode } from 'react';
import { Card, Space, Tag } from 'antd';
import { motion } from 'framer-motion';

// 创建带动画效果的卡片组件
const MotionCard = motion(Card);

export interface TechStackCardProps {
  title: string;
  icon: ReactNode;
  items: string[];
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

const TechStackCard: React.FC<TechStackCardProps> = ({ 
  title, 
  icon, 
  items, 
  color, 
  index = 0 
}) => {
  // 根据颜色名称获取对应的颜色代码
  const getBorderColor = () => {
    switch(color) {
      case 'blue': return '#1890ff';
      case 'green': return '#52c41a';
      case 'magenta': return '#eb2f96';
      default: return '#1890ff';
    }
  };

  return (
    <MotionCard
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariants}
      title={
        <Space>
          {icon}
          {title}
        </Space>
      }
      style={{ height: '100%' }}
      headStyle={{ borderBottom: `2px solid ${getBorderColor()}` }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        transition: { duration: 0.3 }
      }}
    >
      <div style={{ minHeight: '120px' }}>
        {items.map((item, i) => (
          <Tag
            key={i}
            style={{ margin: '4px', fontSize: '14px', padding: '4px 12px' }}
            color={color}
          >
            {item}
          </Tag>
        ))}
      </div>
    </MotionCard>
  );
};

export default TechStackCard; 