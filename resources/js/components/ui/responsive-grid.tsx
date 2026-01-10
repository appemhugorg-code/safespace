import * as React from "react"
import { cn } from "@/lib/utils"

interface ResponsiveGridProps extends React.ComponentProps<"div"> {
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
}

function ResponsiveGrid({ 
  className, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'md',
  children,
  ...props 
}: ResponsiveGridProps) {
  const gapClasses = {
    xs: 'gap-2',
    sm: 'gap-3', 
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12'
  };

  // Ensure proper mobile-first responsive classes
  const mobileColumns = Math.min(columns.mobile || 1, 2); // Max 2 columns on mobile
  const tabletColumns = columns.tablet || Math.min((columns.mobile || 1) + 1, 4);
  const desktopColumns = columns.desktop || tabletColumns;

  const gridClasses = cn(
    "grid w-full",
    `grid-cols-${mobileColumns}`,
    `sm:grid-cols-${Math.min(tabletColumns, 3)}`,
    `md:grid-cols-${tabletColumns}`,
    `lg:grid-cols-${desktopColumns}`,
    gapClasses[gap],
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
}

export { ResponsiveGrid, type ResponsiveGridProps };