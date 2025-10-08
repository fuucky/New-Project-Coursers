'use client'; 

import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Definimos a interface manualmente e usamos 'any' no 'attribute'
// para contornar o erro de tipagem persistente no seu ambiente.
interface ThemeProviderProps {
  children: React.ReactNode;
  
  // Mude para 'any' para forçar o TS a aceitar 'attribute="class"'
  attribute?: any; 
  
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      // O erro em 'attribute="class"' deve sumir agora
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}