import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.ComponentProps<"div"> {
  size?: 'sm' | 'md' | 'lg';
}

function LoadingSpinner({ className, size = 'md', ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-muted border-t-primary",
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}

interface LoadingCardProps {
  className?: string;
  lines?: number;
}

function LoadingCard({ className, lines = 3 }: LoadingCardProps) {
  return (
    <div className={cn("animate-fade-in p-4 sm:p-6 space-y-3", className)}>
      <div className="loading-shimmer h-4 rounded w-3/4"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="loading-shimmer h-3 rounded"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        ></div>
      ))}
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

function LoadingButton({ children, loading = false, className, ...props }: LoadingButtonProps & React.ComponentProps<"button">) {
  return (
    <button 
      className={cn("relative", className)} 
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </button>
  );
}

export { LoadingSpinner, LoadingCard, LoadingButton };