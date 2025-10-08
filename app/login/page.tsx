// app/login/page.tsx (APENAS ESTE CÓDIGO)

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login | Aprimore Conhecimentos',
  description: 'Faça login para acessar seu painel de estudos privado.',
};

export default function LoginPage() {
  // O estilo deve vir do layout.tsx
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4">
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        PÁGINA DE LOGIN APARECEU!
      </h1>
      
    </div>
  );
}