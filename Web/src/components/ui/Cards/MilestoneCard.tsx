import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { motion } from 'framer-motion';

const { Text } = Typography;

export interface MilestoneCardProps {
  title: string;
  description: string;
  time: string;
  color: string;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ 
  title, 
  description, 
  time, 
  color 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        size="small"
        title={title}
        extra={<Tag color={color}>{time}</Tag>}
        style={{ 
          width: 300, 
          borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
        }}
      >
        <Text type="secondary">{description}</Text>
      </Card>
    </motion.div>
  );
};

export default MilestoneCard; 