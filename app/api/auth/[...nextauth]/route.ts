// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcryptjs'

// Inicializa o cliente Prisma para interagir com o banco de dados
const prisma = new PrismaClient()

// ⭐️ Opções de Autenticação
export const authOptions: NextAuthOptions = {
    // 1. ADAPTADOR: Conecta o NextAuth ao Prisma para gerenciar usuários, sessões, etc.
    adapter: PrismaAdapter(prisma), 
    
    // 2. PROVEDORES: Define como o usuário pode fazer login (usaremos email/senha)
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                // Busca o usuário no banco de dados pelo email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                // Verifica se o usuário existe e se possui uma senha registrada
                if (!user || !user.password) {
                    return null
                }

                // Compara a senha fornecida com a senha criptografada no banco
                const isValidPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isValidPassword) {
                    return null
                }
                
                // Sucesso: Retorna um objeto de usuário minimalista
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            }
        })
    ],
    
    // 3. CONFIGURAÇÕES
    session: {
        strategy: "jwt", // Usa JSON Web Tokens para gerenciar a sessão
    },
    pages: {
        signIn: "/login", // Página de login customizada
        error: "/login",
    },
    callbacks: {
        // Adiciona o ID do usuário ao token JWT
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        // Adiciona o ID do usuário à sessão
        session: ({ session, token }) => {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    }
}

// ⭐️ Exporta os métodos GET e POST que o NextAuth requer
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }