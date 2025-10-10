'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '../../components/Dashboard' // ajuste o caminho se necessário

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Verifica login apenas no cliente
    const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

    if (!loggedIn) {
      router.push('/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    )
  }

  return <Dashboard />
}
