import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/kp/db'
import { currentClient } from '@/lib/kp/client-auth'
export async function GET(request: NextRequest) {
  const client = await currentClient(); if (!client) return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  const id = request.nextUrl.searchParams.get('id')
  const { data: session } = await db.from('kp_sessoes').select('id,empresa,grupo,tipo,criado_em,cliente_id').eq('id', id).eq('cliente_id', client.id).maybeSingle()
  if (!session) return NextResponse.json({ erro: 'Pesquisa não encontrada.' }, { status: 404 })
  const { data } = await db.from('kp_respostas').select('respostas,comentario,criado_em').eq('sessao_id', id).order('criado_em', { ascending: false })
  return NextResponse.json({ session, responses: data ?? [] })
}
