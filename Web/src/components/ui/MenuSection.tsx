import React, { useState, ReactNode } from 'react';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

interface MenuSectionProps {
  title: string;
  icon?: ReactNode;
  defaultExpanded?: boolean;
  children: ReactNode;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  title,
  icon,
  defaultExpanded = false,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="mb-2">
      <div
        className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100"
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        <div className="ml-auto">
          {expanded ? <DownOutlined /> : <RightOutlined />}
        </div>
      </div>
      {expanded && (
        <div className="mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default MenuSection; 