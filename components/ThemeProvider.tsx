"use client";
import { useEffect } from "react";

export default function ThemeProvider() {
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only change if user hasn't explicitly set a preference in localStorage
      if (!('theme' in localStorage)) {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        // Dispatch custom event to notify components like the Home toggle
        window.dispatchEvent(new Event('themechange'));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return null;
}
