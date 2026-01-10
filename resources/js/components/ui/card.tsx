import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.ComponentProps<"div"> {
  variant?: 'default' | 'elevated' | 'outlined';
  spacing?: 'compact' | 'comfortable' | 'spacious';
  interactive?: boolean;
  loading?: boolean;
}

function Card({ 
  className, 
  variant = 'default', 
  spacing = 'comfortable', 
  interactive = false,
  loading = false,
  ...props 
}: CardProps) {
  const baseClasses = "bg-card text-card-foreground flex flex-col rounded-xl border transition-all duration-200 animate-fade-in";
  
  const variantClasses = {
    default: 'shadow-sm border-border',
    elevated: 'card-elevated',
    outlined: 'card-outlined'
  };
  
  const spacingClasses = {
    compact: 'gap-3 py-3 sm:gap-4 sm:py-4',
    comfortable: 'gap-4 py-4 sm:gap-6 sm:py-6', 
    spacious: 'gap-6 py-6 sm:gap-8 sm:py-8'
  };

  const interactiveClasses = interactive ? 'card-hover cursor-pointer mobile-tap' : '';
  const loadingClasses = loading ? 'loading-shimmer' : '';

  return (
    <div
      data-slot="card"
      className={cn(
        baseClasses,
        variantClasses[variant],
        spacingClasses[spacing],
        interactiveClasses,
        loadingClasses,
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("flex flex-col gap-2 px-4 sm:gap-md sm:px-6", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-heading leading-none", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-body-sm", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-4 sm:px-6 gap-3 sm:gap-md", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
