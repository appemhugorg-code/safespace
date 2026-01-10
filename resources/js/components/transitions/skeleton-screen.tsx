/**
 * Skeleton Screen Component
 * 
 * Provides skeleton loading states for better perceived performance
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/theme-context';

interface SkeletonProps {
  /** Width of the skeleton */
  width?: string | number;
  /** Height of the skeleton */
  height?: string | number;
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Custom className */
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  radius = 'md',
  className = '',
}) => {
  const { theme } = useTheme();
  const reducedMotion = theme.animations?.reducedMotion ?? false;

  const radiusClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const shimmerAnimation = reducedMotion
    ? {}
    : {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        },
      };

  return (
    <motion.div
      className={`bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] ${radiusClasses[radius]} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
      animate={shimmerAnimation}
    />
  );
};

// Pre-built skeleton components for common use cases
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        height="1rem"
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{
  showAvatar?: boolean;
  className?: string;
}> = ({ showAvatar = false, className = '' }) => (
  <div className={`p-4 space-y-3 ${className}`}>
    <div className="flex items-center space-x-3">
      {showAvatar && (
        <Skeleton width={40} height={40} radius="full" />
      )}
      <div className="flex-1 space-y-2">
        <Skeleton height="1rem" width="60%" />
        <Skeleton height="0.75rem" width="40%" />
      </div>
    </div>
    <SkeletonText lines={2} />
  </div>
);

export const SkeletonList: React.FC<{
  items?: number;
  showAvatars?: boolean;
  className?: string;
}> = ({ items = 5, showAvatars = false, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} showAvatar={showAvatars} />
    ))}
  </div>
);

export const SkeletonDashboard: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header */}
    <div className="space-y-2">
      <Skeleton height="2rem" width="40%" />
      <Skeleton height="1rem" width="60%" />
    </div>
    
    {/* Stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg space-y-3">
          <Skeleton height="1rem" width="50%" />
          <Skeleton height="2rem" width="30%" />
          <Skeleton height="0.75rem" width="70%" />
        </div>
      ))}
    </div>
    
    {/* Main content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="40%" />
        <SkeletonList items={3} showAvatars />
      </div>
      <div className="space-y-4">
        <Skeleton height="1.5rem" width="40%" />
        <Skeleton height="200px" radius="lg" />
      </div>
    </div>
  </div>
);

export const SkeletonProfile: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Profile header */}
    <div className="flex items-center space-x-4">
      <Skeleton width={80} height={80} radius="full" />
      <div className="flex-1 space-y-2">
        <Skeleton height="1.5rem" width="40%" />
        <Skeleton height="1rem" width="60%" />
        <Skeleton height="0.75rem" width="30%" />
      </div>
    </div>
    
    {/* Profile sections */}
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton height="1.25rem" width="30%" />
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;