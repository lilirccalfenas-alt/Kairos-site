import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { requireResearchUser } from '@/lib/research-auth'
import { dimensoes } from '@/lib/pesquisa-data'

type Params = { params: Promise<{ id: string }> }
const csv = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`
const normalize = (value: string | null | undefined) => (value ?? '').trim().toLocaleLowerCase('pt-BR')

export async function GET(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { data: anchor } = await supabase.from('sessoes').select('id, empresa').eq('id', id).maybeSingle()
  if (!anchor) return NextResponse.json({ error: 'Pesquisa não encontrada.' }, { status: 404 })
  const { data: sessions } = await supabase.from('sessoes').select('id, empresa, grupo')
  const companySessions = (sessions ?? []).filter((session) => normalize(session.empresa) === normalize(anchor.empresa))
  const { data: answers } = await supabase.from('respostas').select('sessao_id, respostas, comentario, criado_em').in('sessao_id', companySessions.map((session) => session.id)).order('criado_em', { ascending: true })
  if ((answers?.length ?? 0) < 3) return NextResponse.json({ error: 'O relatório da empresa é liberado a partir de 3 respostas.' }, { status: 403 })
  const sessionById = new Map(companySessions.map((session) => [session.id, session]))
  const questions = dimensoes.flatMap(([, items]) => items)
  const rows = [['empresa', 'função', 'criado_em', ...questions, 'comentario'].map(csv).join(','), ...(answers ?? []).map((answer) => { const session = sessionById.get(answer.sessao_id); return [anchor.empresa, session?.grupo ?? 'Outras funções', answer.criado_em, ...questions.map((_, index) => (answer.respostas as Record<string, unknown>)[String(index)] ?? ''), answer.comentario ?? ''].map(csv).join(',') })]
  return new NextResponse(`\uFEFF${rows.join('\n')}`, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="relatorio-${id}.csv"` } })
}
