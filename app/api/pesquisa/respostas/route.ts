import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { dimensoes } from '@/lib/pesquisa-data'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const sessaoId = typeof body.sessaoId === 'string' ? body.sessaoId : ''
    const respostas = body.respostas
    const comentario = typeof body.comentario === 'string' ? body.comentario.slice(0, 500) : null
    const total = dimensoes.reduce((sum, [, items]) => sum + items.length, 0)
    if (!sessaoId || !respostas || typeof respostas !== 'object' || Object.keys(respostas).length !== total) return NextResponse.json({ error: 'Complete todas as respostas.' }, { status: 400 })
    const values = Object.values(respostas as Record<string, unknown>)
    if (values.some((value) => !Number.isInteger(value) || Number(value) < 1 || Number(value) > 5)) return NextResponse.json({ error: 'Respostas inválidas.' }, { status: 400 })
    const supabase = getSupabase()
    const { data: sessao, error: sessionError } = await supabase.from('sessoes').select('id, aberta, expira_em').eq('id', sessaoId).maybeSingle()
    if (sessionError || !sessao || !sessao.aberta || (sessao.expira_em && new Date(sessao.expira_em) < new Date())) return NextResponse.json({ error: 'Pesquisa encerrada.' }, { status: 410 })
    const { error } = await supabase.from('respostas').insert({ sessao_id: sessaoId, respostas, comentario })
    if (error) return NextResponse.json({ error: 'Não foi possível registrar.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
