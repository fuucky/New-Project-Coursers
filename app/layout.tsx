import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
// 🛑 Remova a importação direta: import { ThemeProvider } from '../components/ThemeProvider' 

import { ThemeToggle } from 'components/ThemeToggle'
import dynamic from 'next/dynamic' // <-- Importe o dynamic

const inter = Inter({ subsets: ['latin'] })

// 1. Dynamic Import simplificado, pois agora é 'export default'
const DynamicThemeProvider = dynamic(
  () => import('../components/ThemeProvider'), // Não precisa mais de .then((mod) => mod.ThemeProvider)
  {
    ssr: false, // CHAVE para resolver a hidratação do 'next-themes'
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
    // 2. Mantenha suppressHydrationWarning na tag <html>
    <html lang="pt-BR" suppressHydrationWarning> 
      <body 
        className={`${inter.className} min-h-screen transition-colors duration-500`}
      >
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
      </body>
    </html>
  )
}