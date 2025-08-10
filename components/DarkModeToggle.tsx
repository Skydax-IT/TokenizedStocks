'use client';

import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

export default function DarkModeToggle() {
  const { theme, isDark, toggleTheme, setLightMode, setDarkMode, setSystemMode } = useDarkMode();

  return (
    <div className="relative">
      {/* Main toggle button */}
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        aria-label={`Current theme: ${theme}. Click to toggle.`}
        aria-expanded="false"
        aria-haspopup="true"
      >
        {theme === 'light' ? (
          <SunIcon className="h-4 w-4" />
        ) : theme === 'dark' ? (
          <MoonIcon className="h-4 w-4" />
        ) : (
          <ComputerDesktopIcon className="h-4 w-4" />
        )}
        <span className="hidden sm:inline">
          {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
        </span>
      </button>

      {/* Theme options dropdown (optional - can be expanded later) */}
      {/* 
      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
        <div className="py-1">
          <button
            onClick={setLightMode}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === 'light' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <SunIcon className="h-4 w-4" />
            Light
          </button>
          <button
            onClick={setDarkMode}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === 'dark' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <MoonIcon className="h-4 w-4" />
            Dark
          </button>
          <button
            onClick={setSystemMode}
            className={`flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
              theme === 'system' ? 'text-brand-600 dark:text-brand-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <ComputerDesktopIcon className="h-4 w-4" />
            System
          </button>
        </div>
      </div>
      */}
    </div>
  );
}
