'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  html {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    background-color: #0c0a09;
    color-scheme: dark;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
    font-family: ${({ theme }) => theme.fonts.sans};
    min-height: 100vh;
    min-height: -webkit-fill-available;
    overflow-x: hidden;
  }

  *, *::before, *::after {
    border-color: ${({ theme }) => theme.colors.border};
  }

  #__next, main {
    overflow-x: hidden;
  }

  button, a, [role="button"] {
    touch-action: manipulation;
  }

  * {
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 767px) {
    input[type="text"],
    input[type="email"],
    input[type="password"],
    input[type="number"],
    input[type="tel"],
    input[type="date"],
    select,
    textarea {
      font-size: 16px !important;
    }
  }

  @supports (padding: max(0px)) {
    body {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.muted}30;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 4px;

    &:hover {
      background: ${({ theme }) => theme.colors.foreground}30;
    }
  }

  @media (max-width: 767px) {
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
  }
`;
