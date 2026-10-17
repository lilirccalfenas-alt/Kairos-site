import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('sessoes').select('id, empresa, grupo, criado_em, aberta').order('criado_em', { ascending: false })
  if (error) return NextResponse.json({ error: 'Não foi possível carregar as pesquisas.' }, { status: 500 })
  const sessions = await Promise.all((data ?? []).map(async (session) => {
    const { count } = await supabase.from('respostas').select('id', { count: 'exact', head: true }).eq('sessao_id', session.id)
    return { ...session, respostas: count ?? 0 }
  }))
  return NextResponse.json({ sessions })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const empresa = typeof body.empresa === 'string' ? body.empresa.trim().slice(0, 120) : ''
    const grupo = typeof body.grupo === 'string' ? body.grupo.trim().slice(0, 120) : null
    if (!empresa) return NextResponse.json({ error: 'Informe a empresa.' }, { status: 400 })
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('sessoes').insert({ empresa, grupo, tipo: 'clima' }).select('id').single()
    if (error) return NextResponse.json({ error: 'Não foi possível criar a pesquisa.' }, { status: 500 })
    return NextResponse.json({ id: data.id })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
