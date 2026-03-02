'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { darkTheme } from './theme-config';

type ThemeMode = 'dark';

type ThemeContextType = {
  themeMode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'dark',
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeMode: ThemeMode = 'dark';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
    document.documentElement.style.backgroundColor = '#0c0a09';
  }, []);

  return (
    <ThemeContext.Provider value={{ themeMode }}>
      <StyledThemeProvider theme={darkTheme}>{children}</StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
