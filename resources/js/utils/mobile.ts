import * as React from 'react';

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

export function getViewportSize() {
  if (typeof window === 'undefined') return { width: 0, height: 0 };
  
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

export function isSmallScreen(): boolean {
  const { width } = getViewportSize();
  return width < 768; // Tailwind's md breakpoint
}

export function isMediumScreen(): boolean {
  const { width } = getViewportSize();
  return width >= 768 && width < 1024; // Between md and lg
}

export function isLargeScreen(): boolean {
  const { width } = getViewportSize();
  return width >= 1024; // Tailwind's lg breakpoint and above
}

export function addMobileOptimizations() {
  if (typeof document === 'undefined') return;
  
  // Prevent zoom on input focus for iOS
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && isMobileDevice()) {
    viewport.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
  
  // Add touch-action CSS for better touch handling
  document.body.style.touchAction = 'manipulation';
}

// Hook for responsive behavior
export function useResponsive() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      width: 1024,
      height: 768
    };
  }

  const [dimensions, setDimensions] = React.useState(getViewportSize);

  React.useEffect(() => {
    function handleResize() {
      setDimensions(getViewportSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: dimensions.width < 768,
    isTablet: dimensions.width >= 768 && dimensions.width < 1024,
    isDesktop: dimensions.width >= 1024,
    width: dimensions.width,
    height: dimensions.height
  };
}