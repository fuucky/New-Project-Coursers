// components/LoginForm.tsx

'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // **Lógica de Autenticação Real Virá Aqui**
    console.log('Login attempt:', { email, password });
    
    // Simulação de delay (remover depois de implementar a lógica real)
    setTimeout(() => {
      setLoading(false);
      // Ex: Redirecionamento para o Dashboard: router.push('/dashboard')
    }, 1500); 
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 
                    bg-white dark:bg-gray-800 
                    rounded-xl shadow-2xl 
                    transition-colors duration-300">
      
      <h2 className="text-3xl font-extrabold text-center 
                     text-gray-900 dark:text-gray-100">
        <LogIn className="w-8 h-8 inline-block mr-2" />
        Acessar Painel
      </h2>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        
        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium 
                                            text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border 
                       border-gray-300 dark:border-gray-600 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       text-gray-900 dark:text-white 
                       rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       bg-gray-50 dark:bg-gray-700 
                       focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="seu@email.com"
          />
        </div>

        {/* Campo Senha */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium 
                                              text-gray-700 dark:text-gray-300">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none relative block w-full px-3 py-2 border 
                       border-gray-300 dark:border-gray-600 
                       placeholder-gray-500 dark:placeholder-gray-400 
                       text-gray-900 dark:text-white 
                       rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 
                       bg-gray-50 dark:bg-gray-700 
                       focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
            placeholder="••••••••"
          />
        </div>

        {/* Botão de Login */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                       text-sm font-medium rounded-md text-white 
                       bg-indigo-600 hover:bg-indigo-700 
                       dark:bg-indigo-500 dark:hover:bg-indigo-600 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              // Ícone de carregamento
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Entrar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}