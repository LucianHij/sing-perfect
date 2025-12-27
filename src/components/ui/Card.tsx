import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

/**
 * L1 Base Component: Card
 * Provides consistent card styling across the application
 */
export const Card: React.FC<CardProps> = ({ children, className = '', padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};
