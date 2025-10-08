'use client'; 

// Importa o provedor e os tipos nativos do next-themes
// Esta é a forma que o Next.js espera que você importe os tipos.
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
// Remova a linha "import { ComponentProps } from 'react';"

// Não precisamos da definição manual ou do 'ComponentProps'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
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