import React from 'react';

const Card = ({ children, className = '', title, subtitle, variant = 'default', ...props }) => {
  const baseClasses = 'rounded-3xl border transition-all duration-300 hover:shadow-lg';
  
  const variants = {
    default: 'bg-white/70 backdrop-blur-sm border-white/20 shadow-xl',
    glass: 'bg-white/60 backdrop-blur-md border-white/30 shadow-2xl',
    solid: 'bg-white border-gray-200 shadow-md',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-100 shadow-xl'
  };

  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-8 py-6 border-b border-gray-100/50">
          {title && (
            <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-8 py-6 border-b border-gray-100/50 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`px-8 py-6 border-t border-gray-100/50 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
