'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '../components/Dashboard'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-whited dark:bg-gray-900 min-h-full">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Página Inicial de Teste 
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          O layout está funcionando! Próxima etapa: Login.
        </p>
    </div>
  );
  
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (!loggedIn) {
      router.push('/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  if (!isLoggedIn) {
    return <div>Carregando...</div>
  }

  return <Dashboard />
}