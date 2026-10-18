import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/kp/db'
import { clientCookie, COOKIE, verifyPassword } from '@/lib/kp/client-auth'
export async function POST(request: NextRequest) {
  const { email, senha } = await request.json()
  if (!email || !senha) return NextResponse.json({ erro: 'Informe e-mail e senha.' }, { status: 400 })
  const { data } = await db.from('kp_clientes').select('id,empresa,responsavel,email,senha_hash,ativo').ilike('email', String(email).trim()).eq('ativo', true).maybeSingle()
  if (!data || !verifyPassword(String(senha), data.senha_hash || '')) return NextResponse.json({ erro: 'E-mail ou senha inválidos.' }, { status: 401 })
  const response = NextResponse.json({ cliente: { id: data.id, empresa: data.empresa, responsavel: data.responsavel, email: data.email } })
  response.cookies.set(COOKIE, clientCookie(data.id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
  return response
}
