import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tokenized-stocks-theme');
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        setTheme(stored as Theme);
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
      if (systemDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    } else {
      const isDarkMode = theme === 'dark';
      setIsDark(isDarkMode);
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, isLoaded]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Save theme to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('tokenized-stocks-theme', theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [theme, isLoaded]);

  const setLightMode = useCallback(() => {
    setTheme('light');
  }, []);

  const setDarkMode = useCallback(() => {
    setTheme('dark');
  }, []);

  const setSystemMode = useCallback(() => {
    setTheme('system');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      if (prev === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return systemDark ? 'light' : 'dark';
      }
      return prev === 'light' ? 'dark' : 'light';
    });
  }, []);

  return {
    theme,
    isDark,
    isLoaded,
    setLightMode,
    setDarkMode,
    setSystemMode,
    toggleTheme,
  };
}
