import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { requireResearchUser } from '@/lib/research-auth'
import { dimensoes, totalItens } from '@/lib/pesquisa-data'

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { data: session, error: sessionError } = await supabase.from('sessoes').select('id, empresa, grupo, criado_em').eq('id', id).maybeSingle()
  if (sessionError || !session) return NextResponse.json({ error: 'Pesquisa não encontrada.' }, { status: 404 })
  const { data: answers, error } = await supabase.from('respostas').select('respostas, criado_em').eq('sessao_id', id).order('criado_em', { ascending: true })
  if (error) return NextResponse.json({ error: 'Não foi possível carregar os resultados.' }, { status: 500 })
  if ((answers?.length ?? 0) < 3) return NextResponse.json({ available: false, session, total: answers?.length ?? 0, minimum: 3 })
  const questions = dimensoes.flatMap(([dimension, items]) => items.map((question) => ({ dimension, question })))
  const averages = questions.map((item, index) => {
    const key = String(index)
    const values = (answers ?? []).map((answer) => Number((answer.respostas as Record<string, unknown>)[key])).filter(Number.isFinite)
    return { ...item, average: values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0 }
  })
  const dimensions = dimensoes.map(([name, items], dimensionIndex) => {
    const values = averages.slice(dimensionIndex * items.length, (dimensionIndex + 1) * items.length).map((item) => item.average)
    return { name, average: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) }
  })
  return NextResponse.json({ available: true, session, total: answers?.length ?? 0, averages, dimensions, totalItens })
}
