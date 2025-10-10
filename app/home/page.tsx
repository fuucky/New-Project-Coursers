'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

// Evita SSR (server-side rendering)
const Dashboard = dynamic(() => import('../../components/Dashboard'), { ssr: false })

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

      if (!loggedIn) {
        router.replace('/login')
      } else {
        setIsLoggedIn(true)
      }

      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    )
  }

  if (!isLoggedIn) return null

  return Dashboard 
}
