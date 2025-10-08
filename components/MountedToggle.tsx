'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function MountedToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 
                 text-gray-800 dark:text-gray-200"
    >
      {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
    </button>
  )
}
