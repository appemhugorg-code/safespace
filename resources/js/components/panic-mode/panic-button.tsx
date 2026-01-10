import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield } from 'lucide-react';

interface PanicButtonProps {
  onActivate: () => void;
  isActive?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'floating' | 'inline' | 'discrete';
  className?: string;
}

export function PanicButton({ 
  onActivate, 
  isActive = false, 
  size = 'medium', 
  variant = 'floating',
  className = '' 
}: PanicButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12 text-sm';
      case 'large':
        return 'w-20 h-20 text-lg';
      default:
        return 'w-16 h-16 text-base';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'inline':
        return 'relative';
      case 'discrete':
        return 'fixed bottom-4 right-4 opacity-70 hover:opacity-100';
      default:
        return 'fixed bottom-6 right-6';
    }
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      onActivate();
      setIsPressed(false);
    }, 1000); // 1 second hold
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = () => {
    if (variant === 'inline') {
      onActivate();
    }
  };

  if (isActive) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`${getVariantClasses()} ${getSizeClasses()} ${className}`}
      >
        <div className="relative">
          <div className="w-full h-full bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={`${getVariantClasses()} ${getSizeClasses()} ${className} z-50`}
      onMouseDown={variant !== 'inline' ? handleMouseDown : undefined}
      onMouseUp={variant !== 'inline' ? handleMouseUp : undefined}
      onMouseLeave={handleMouseUp}
      onClick={variant === 'inline' ? handleClick : undefined}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPressed ? 1.1 : 1,
        boxShadow: isPressed 
          ? '0 0 0 4px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.5)' 
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
      }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative w-full h-full">
        {/* Main Button */}
        <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors ${
          isPressed 
            ? 'bg-red-700' 
            : 'bg-red-600 hover:bg-red-700'
        }`}>
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>

        {/* Press Progress Ring */}
        {isPressed && variant !== 'inline' && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-red-300"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "linear" }}
            style={{
              background: `conic-gradient(from 0deg, transparent 0deg, rgba(239, 68, 68, 0.3) ${isPressed ? '360deg' : '0deg'})`,
            }}
          />
        )}

        {/* Pulse Animation */}
        <motion.div
          className="absolute inset-0 rounded-full bg-red-600 opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Tooltip */}
      {variant === 'floating' && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {variant === 'inline' ? 'Get Help Now' : 'Hold for 1 second'}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </motion.button>
  );
}