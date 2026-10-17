import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { dimensoes } from '@/lib/pesquisa-data'

type Params = { params: Promise<{ id: string }> }
const csv = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { data: session } = await supabase.from('sessoes').select('empresa, grupo').eq('id', id).maybeSingle()
  if (!session) return NextResponse.json({ error: 'Pesquisa não encontrada.' }, { status: 404 })
  const { data: answers } = await supabase.from('respostas').select('respostas, comentario, criado_em').eq('sessao_id', id).order('criado_em', { ascending: true })
  if ((answers?.length ?? 0) < 3) return NextResponse.json({ error: 'Resultados disponíveis a partir de 3 respostas.' }, { status: 403 })
  const questions = dimensoes.flatMap(([, items]) => items)
  const rows = [
    ['empresa', 'grupo', 'criado_em', ...questions, 'comentario'].map(csv).join(','),
    ...(answers ?? []).map((answer) => [session.empresa, session.grupo ?? '', answer.criado_em, ...questions.map((_, index) => (answer.respostas as Record<string, unknown>)[String(index)] ?? ''), answer.comentario ?? ''].map(csv).join(',')),
  ]
  return new NextResponse(`\uFEFF${rows.join('\n')}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="pesquisa-${id}.csv"` } })
}
