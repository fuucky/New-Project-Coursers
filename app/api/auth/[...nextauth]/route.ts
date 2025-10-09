import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
// Use a sintaxe de importação robusta para garantir que funcione no Next.js
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      // Os campos que você precisa para fazer login (email e senha)
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      
      async authorize(credentials, req) {
        // Garantindo que email e senha foram fornecidos
        if (!credentials?.email || !credentials?.password) {
          // Retornar null causa falha no login
          return null; 
        }

        try {
          // 1. Encontrar o usuário no banco de dados pelo email
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          // Se o usuário não for encontrado ou não tiver senha (deveria ter)
          if (!user || !user.password) {
            console.log('--- NEXTAUTH DEBUG ---');
            console.log(`Tentativa de Login Falhou: Usuário não encontrado para o email: ${credentials.email}`);
            console.log('--- END DEBUG ---');
            return null;
          }

          // 2. Comparar a senha fornecida com a senha criptografada no banco
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password 
          );

          // >>>>>> LOG DE DEBUG CRÍTICO AQUI <<<<<<<
          console.log('--- NEXTAUTH DEBUG ---');
          console.log(`Usuário Encontrado: ${user.email}`);
          console.log(`Comparação de Senha Válida: ${isPasswordValid}`);
          console.log('--- END DEBUG ---');
          // >>>>>> FIM LOG DE DEBUG CRÍTICO <<<<<<<

          if (isPasswordValid) {
            // Sucesso
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          } else {
            return null; // Senha incorreta
          }

        } catch (error) {
          console.error('Erro no handler de autorização (Prisma/Bcrypt):', error);
          return null; 
        }
      },
    }),
  ],
  // Você precisa especificar explicitamente a rota de login/redirect se estiver usando o App Router
  pages: {
    signIn: '/login',
    error: '/login', // Redireciona para /login?error=... em caso de falha.
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Configuração padrão para Next.js App Router
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
