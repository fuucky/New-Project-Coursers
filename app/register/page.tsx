'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Lock } from 'lucide-react' // Ícones

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // 1. Envia os dados para a API Route de registro (Backend)
      // O endpoint correto é /api/register
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Trata erros da API (ex: email já cadastrado, status 409)
        setError(data.message || 'Erro ao registrar. Verifique os dados.')
      } else {
        // Registro bem-sucedido
        setSuccess(true)
        setError(null)
        // Redireciona para o login após 2 segundos
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (err) {
      setError('Falha na conexão com o servidor. Verifique o console para mais detalhes.')
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl dark:bg-gray-800">
        <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-white">Criar Conta</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">
            Junte-se ao NP-Coursers para organizar seus estudos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300">
              Registro realizado com sucesso! Redirecionando para o login...
            </div>
          )}

          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="sr-only">Nome</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="name"
                type="text"
                required
                placeholder="Seu Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                placeholder="Seu Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                disabled={loading}
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label htmlFor="password" className="sr-only">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                required
                placeholder="Crie uma Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-md"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Já tem uma conta? <a href="/login" className="text-blue-600 hover:underline font-medium">Fazer Login</a>
        </p>
      </div>
    </div>
  )
}