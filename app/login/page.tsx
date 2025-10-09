'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Lock, Eye, EyeOff, Mail } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      // 1. Chama a função signIn do NextAuth com o provedor 'credentials'
      const result = await signIn('credentials', {
        redirect: false, // CRÍTICO: Não deixa o NextAuth gerenciar o redirect automaticamente
        email,
        password,
      })

      if (result?.error) {
        // NextAuth retorna 'CredentialsSignin' ou outro erro de servidor/configuração
        setError('Falha na autenticação. E-mail ou senha incorretos.')
        setPassword('') // Limpar a senha por segurança
      } else if (result?.ok) {
        // 🚨 NOVO TRATAMENTO DE REDIRECIONAMENTO:
        // Se a autenticação foi bem-sucedida no servidor (que sabemos que foi),
        // forçamos a atualização da sessão e navegamos.
        router.push('/')
        router.refresh() 
        // ---------------------------------------------
      } else {
        // Caso de erro inesperado onde result.ok é false mas sem result.error
        setError('Erro desconhecido. Por favor, tente novamente.')
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado durante o login. Verifique o console do navegador.')
      console.error('Erro ao tentar login:', err);
    } finally {
      setLoading(false)
    }
  }

  // Mapeia o erro da URL para uma mensagem amigável
  const getErrorMessage = (errorType: string | null) => {
    if (errorType === 'CredentialsSignin') {
        return 'E-mail ou senha incorretos. Tente novamente.'
    }
    if (errorType) {
        return `Ocorreu um erro de servidor: ${errorType}. Verifique o terminal para erros de configuração.`
    }
    return null;
  }
  
  const displayError = error || getErrorMessage(urlError);

  return (
    <div className="min-h-screen flex items-center justify-center bg-darkmode">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <Lock className="mx-auto h-12 w-12 text-blue-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Aprimore Conhecimentos</h1>
          <p className="text-gray-500">Faça login com seu email e senha</p>
        </div>
        
        {displayError && (
          <div className="text-red-700 bg-red-100 text-sm mb-4 p-3 rounded border border-red-300">
            {displayError}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          
          {/* Campo Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          {/* Campo Senha */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Sua senha secreta"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={loading}
              >
                {showPassword 
                    ? <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" /> 
                    : <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-4">
            Não tem uma conta? <a href="/register" className="text-blue-600 hover:underline font-medium">Cadastre-se</a>
        </p>
      </div>
    </div>
  )
}
