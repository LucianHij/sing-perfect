import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info';
  icon?: React.ReactNode;
}

/**
 * L1 Base Component: Badge
 * Small status indicators with semantic color coding
 */
export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', icon }) => {
  const variantStyles = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded ${variantStyles[variant]}`}>
      {icon}
      {children}
    </span>
  );
};
