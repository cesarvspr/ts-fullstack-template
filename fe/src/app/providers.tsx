'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { GlobalStyle } from '@/lib/theme/GlobalStyle';
import { AuthProvider } from '@/lib/auth';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
