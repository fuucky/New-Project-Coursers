import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
import SessionProviderWrapper from './components/SessionProviderWrapper' // Importação relativa
import { ThemeToggle } from './components/ThemeToggle' // Importação relativa

const inter = Inter({ subsets: ['latin'] })

// Dynamic Import para o ThemeProvider.
const DynamicThemeProvider = dynamic(
  () => import('./components/ThemeProvider'),
  {
    ssr: false, // CRÍTICO: Resolve problemas de hidratação do next-themes
    loading: () => null 
  }
);

export const metadata: Metadata = {
  title: 'Aprimore Conhecimentos',
  description: 'Seu sistema de gerenciamento de cursos e estudos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning> 
      <body 
        className={`${inter.className} min-h-screen transition-colors duration-500`}
      >
        {/* CRÍTICO: SessionProvider para compartilhar o estado de autenticação JWT com toda a aplicação */}
        <SessionProviderWrapper>
          <DynamicThemeProvider> 
            <header className="flex justify-between items-center p-4 shadow dark:shadow-gray-700 bg-white dark:bg-gray-900">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Aprimore Conhecimentos
              </span>
              
              <ThemeToggle /> 

            </header>
            
            <main className="p-4 bg-white dark:bg-gray-900 min-h-[calc(100vh-64px)]"> 
              {children}
            </main>
          </DynamicThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  )
}
