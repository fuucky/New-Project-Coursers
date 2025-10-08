'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Importe seu componente principal da aplicação (Cronograma/Dashboard)
import Dashboard from '../components/Dashboard' 

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  // 1. Lógica de Verificação de Login
  useEffect(() => {
    // ⚠️ Atenção: A leitura do localStorage deve ser feita dentro do useEffect
    // para garantir que só ocorra no lado do cliente.
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
    
    if (!loggedIn) {
      // 2. Redirecionamento para a página de login
      router.push('/login')
    } else {
      // 3. Define o estado para renderizar o Dashboard
      setIsLoggedIn(true)
    }
  }, [router]) // O useEffect deve ser executado apenas uma vez, no carregamento da página

  // 4. Retorno: Mostra "Carregando..." (ou um spinner) enquanto verifica o estado
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8">
        <p className="text-xl text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    )
  }

  // 5. Retorno: Renderiza o Dashboard se estiver logado
  return <Dashboard />
}