import React from 'react';

export const More = ({ 
  theme, 
  size, 
  className, 
  fill, 
  strokeWidth 
}: { 
  theme: string; 
  size: string; 
  className: string; 
  fill: string; 
  strokeWidth: number 
}) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="1.5" fill={fill} />
    <circle cx="6" cy="12" r="1.5" fill={fill} />
    <circle cx="18" cy="12" r="1.5" fill={fill} />
  </svg>
);

export const PlusIcon = ({ 
  width, 
  height, 
  alt 
}: { 
  width: number; 
  height: number; 
  alt: string 
}) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 5V19M5 12H19" 
      stroke="#6B7280" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const ThumbtackIcon = ({ 
  className, 
  width, 
  height, 
  alt 
}: { 
  className?: string; 
  width: number; 
  height: number; 
  alt: string 
}) => (
  <svg 
    className={className} 
    width={width} 
    height={height} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 4V12M18 8L13 13M6 8L11 13M12 12V20" 
      stroke="#6B7280" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
); 