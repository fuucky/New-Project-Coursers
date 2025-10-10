'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Importa Dashboard de forma dinâmica (só no client)
const Dashboard = dynamic(() => import('../../components/Dashboard'), { ssr: false })

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Garante execução apenas no cliente
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true'
      if (loggedIn) {
        setIsLoggedIn(true)
      } else {
        router.replace('/login')
      }
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!isLoggedIn) return null

  return <Dashboard />
}
