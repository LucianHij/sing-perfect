import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'tip';
  title?: string;
  className?: string;
}

/**
 * L1 Base Component: InfoBox
 * Consistent information/tip boxes with color-coded variants
 */
export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  variant = 'info',
  title,
  className = ''
}) => {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    tip: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  const titleStyles = {
    info: 'text-blue-900',
    success: 'text-green-900',
    warning: 'text-yellow-900',
    tip: 'text-purple-900',
  };

  return (
    <div className={`p-4 border rounded-lg ${variantStyles[variant]} ${className}`}>
      {title && (
        <p className={`text-sm font-semibold ${titleStyles[variant]} mb-2`}>{title}</p>
      )}
      <div className="text-sm">{children}</div>
    </div>
  );
};
