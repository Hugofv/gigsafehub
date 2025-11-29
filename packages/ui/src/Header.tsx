import React from 'react';

export interface HeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, className = '' }) => {
  return (
    <header className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
      </div>
    </header>
  );
};

