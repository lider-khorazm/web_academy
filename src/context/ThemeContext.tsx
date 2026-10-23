import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('devmaster_theme') as Theme | null;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
      return 'dark'; // Boshlang'ich rejim: dark
    } catch {
      return 'dark';
    }
  });

  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    } else {
      root.classList.remove('light');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    }
    try {
      localStorage.setItem('devmaster_theme', newTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Yumshoq o'tish (fade animatsiyasi) bilan rejimni almashtirish
  const toggleTheme = () => {
    const root = document.documentElement;
    setIsTransitioning(true);
    root.classList.add('theme-fade-transition');

    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(nextTheme);

    setTimeout(() => {
      root.classList.remove('theme-fade-transition');
      setIsTransitioning(false);
    }, 500);
  };

  const setTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    setIsTransitioning(true);
    root.classList.add('theme-fade-transition');

    setThemeState(newTheme);

    setTimeout(() => {
      root.classList.remove('theme-fade-transition');
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
