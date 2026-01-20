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

  // Use static classes instead of dynamic ones to ensure they're included in the build
  const getMobileGridClass = (cols: number) => {
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      default: return 'grid-cols-1';
    }
  };

  const getTabletGridClass = (cols: number) => {
    switch (cols) {
      case 1: return 'sm:grid-cols-1 md:grid-cols-1';
      case 2: return 'sm:grid-cols-2 md:grid-cols-2';
      case 3: return 'sm:grid-cols-2 md:grid-cols-3';
      case 4: return 'sm:grid-cols-2 md:grid-cols-4';
      default: return 'sm:grid-cols-2 md:grid-cols-2';
    }
  };

  const getDesktopGridClass = (cols: number) => {
    switch (cols) {
      case 1: return 'lg:grid-cols-1';
      case 2: return 'lg:grid-cols-2';
      case 3: return 'lg:grid-cols-3';
      case 4: return 'lg:grid-cols-4';
      case 5: return 'lg:grid-cols-5';
      case 6: return 'lg:grid-cols-6';
      default: return 'lg:grid-cols-3';
    }
  };

  const mobileColumns = Math.min(columns.mobile || 1, 4);
  const tabletColumns = Math.min(columns.tablet || 2, 4);
  const desktopColumns = Math.min(columns.desktop || 3, 6);

  const gridClasses = cn(
    "grid w-full",
    getMobileGridClass(mobileColumns),
    getTabletGridClass(tabletColumns),
    getDesktopGridClass(desktopColumns),
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