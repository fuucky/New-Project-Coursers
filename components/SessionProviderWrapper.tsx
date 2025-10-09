'use client';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

// Este componente envolve toda a aplicação para fornecer o contexto de sessão do NextAuth.
// Ele deve ser usado no seu layout principal (app/layout.tsx).

interface SessionProviderWrapperProps {
  children: React.ReactNode;
}

export default function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return (
    // Se você estiver usando o NextAuth App Router, o SessionProvider não precisa da prop 'session'
    // se estiver aninhado dentro de um Server Component que passa a sessão como prop,
    // mas aqui estamos simplificando para o contexto Client Side.
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
