'use client'; 

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Interface
interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: any; 
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

// 🛑 MUDAMOS A EXPORTAÇÃO AQUI
const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

// ⭐️ USE EXPORT DEFAULT
export default ThemeProvider;