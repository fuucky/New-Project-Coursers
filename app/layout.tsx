import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
// Importe o novo componente em vez do ThemeToggle
import { MountedToggle } from '../components/MountedToggle' 

const inter = Inter({ subsets: ['latin'] })

// ... (Metadata)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <html lang="pt-BR" suppressHydrationWarning>
        <body 
          className={`${inter.className} min-h-screen transition-colors duration-500`}
        >
          <header className="flex justify-between items-center p-4 shadow dark:shadow-gray-700 bg-white dark:bg-gray-900">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Aprimore Conhecimentos
            </span>
            
            {/* 3. SUBSTITUA: Use o MountedToggle aqui */}
            <MountedToggle /> 

          </header>
          
          <main className="p-4 bg-white dark:bg-gray-900 min-h-[calc(100vh-64px)]"> 
            {children}
          </main>
        </body>
      </html>
    </ThemeProvider>
  )
}