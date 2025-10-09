import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
// Corrigido para incluir o tipo NextAuthOptions
import type { NextAuthOptions } from 'next-auth'; 
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// A CORREÇÃO PRINCIPAL É AQUI: Adicionar o tipo explícito NextAuthOptions
const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    return null; 
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email,
                        },
                    });

                    if (!user || !user.password) {
                        console.log('--- NEXTAUTH DEBUG ---');
                        console.log(`Tentativa de Login Falhou: Usuário não encontrado para o email: ${credentials.email}`);
                        console.log('--- END DEBUG ---');
                        return null;
                    }

                    const isPasswordValid = await bcrypt.compare(
                        credentials.password,
                        user.password 
                    );

                    console.log('--- NEXTAUTH DEBUG ---');
                    console.log(`Usuário Encontrado: ${user.email}`);
                    console.log(`Comparação de Senha Válida: ${isPasswordValid}`);
                    console.log('--- END DEBUG ---');

                    if (isPasswordValid) {
                        return {
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email,
                        };
                    } else {
                        return null;
                    }

                } catch (error) {
                    console.error('Erro no handler de autorização (Prisma/Bcrypt):', error);
                    return null; 
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    
    // A tipagem agora é resolvida corretamente porque `authOptions` é explicitamente NextAuthOptions
    session: {
        strategy: 'jwt', 
    },
    
    secret: process.env.NEXTAUTH_SECRET,
};

// Configuração padrão para Next.js App Router
const handler = NextAuth(authOptions);


export { handler as GET, handler as POST };