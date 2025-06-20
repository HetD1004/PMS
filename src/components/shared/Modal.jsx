import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true,
  variant = 'default'
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
  };

  const variants = {
    default: 'bg-white/95 backdrop-blur-md border border-white/20',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/30',
    solid: 'bg-white',
    dark: 'bg-gray-900/95 backdrop-blur-md border border-gray-700/50 text-white'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
        
        <div className={`
          relative rounded-3xl shadow-2xl w-full transition-all duration-300 
          transform animate-fade-in ${sizes[size]} ${variants[variant]}
        `}>
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-8 border-b border-gray-200/50">
              {title && (
                <h3 className="text-2xl font-bold text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100/80 transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              )}
            </div>
          )}
          
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
