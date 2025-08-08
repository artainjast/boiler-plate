import { useState, useEffect } from 'react';

export const useCheckWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (window?.innerWidth > 1028) {
      setWindowSize({
        isMobile: false,
        isDesktop: true,
      });
    } else {
      setWindowSize({
        isMobile: true,
        isDesktop: false,
      });
    }
  }, [window?.innerWidth]);

  return {
    windowSize,
  };
};
