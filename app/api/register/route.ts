// app/api/register/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs' // Usaremos o bcrypt para criptografia segura

// Inicializa o cliente Prisma para interagir com o banco de dados
const prisma = new PrismaClient()

// Handler POST para o registro de novos usuários
export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json()

        // 1. Validação de campos
        if (!name || !email || !password) {
            return NextResponse.json({ message: 'Preencha todos os campos: Nome, Email e Senha.' }, { status: 400 })
        }

        // 2. Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ message: 'Este email já está cadastrado. Tente fazer login.' }, { status: 409 })
        }

        // 3. Criptografa a senha
        // Isso é crucial para a segurança. A senha nunca deve ser salva em texto puro.
        const hashedPassword = await bcrypt.hash(password, 10)

        // 4. Cria o novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, // Salva a senha criptografada
            },
        })

        // Retorna o novo usuário (sem a senha)
        return NextResponse.json({ 
            id: newUser.id, 
            name: newUser.name, 
            email: newUser.email 
        }, { status: 201 })

    } catch (error) {
        // Loga o erro interno para depuração
        console.error('Erro no registro:', error)
        return NextResponse.json({ message: 'Erro interno do servidor ao tentar registrar.' }, { status: 500 })
    }
}