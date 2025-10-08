'use client'; 

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ComponentProps } from 'react'; // <--- Importação necessária!

// Extrai as props exatas do componente NextThemesProvider
type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>;

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