import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { requireResearchUser } from '@/lib/research-auth'
import { dimensoes, totalItens } from '@/lib/pesquisa-data'

type Params = { params: Promise<{ id: string }> }
type Answer = { respostas: Record<string, unknown>; comentario: string | null; criado_em: string }
type Session = { id: string; empresa: string; grupo: string | null; criado_em: string }
const normalize = (value: string | null | undefined) => (value ?? '').trim().toLocaleLowerCase('pt-BR')

export async function GET(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { data: anchor, error: anchorError } = await supabase.from('sessoes').select('id, empresa, grupo, criado_em').eq('id', id).maybeSingle()
  if (anchorError || !anchor) return NextResponse.json({ error: 'Pesquisa não encontrada.' }, { status: 404 })

  const { data: sessions, error: sessionsError } = await supabase.from('sessoes').select('id, empresa, grupo, criado_em')
  if (sessionsError) return NextResponse.json({ error: 'Não foi possível carregar as pesquisas da empresa.' }, { status: 500 })
  const companySessions = (sessions ?? []).filter((session) => normalize(session.empresa) === normalize(anchor.empresa)) as Session[]
  const sessionIds = companySessions.map((session) => session.id)
  const { data: answers, error } = await supabase.from('respostas').select('sessao_id, respostas, comentario, criado_em').in('sessao_id', sessionIds).order('criado_em', { ascending: true })
  if (error) return NextResponse.json({ error: 'Não foi possível carregar os resultados.' }, { status: 500 })

  const allAnswers = (answers ?? []) as Answer[]
  const total = allAnswers.length
  const sessionById = new Map(companySessions.map((session) => [session.id, session]))
  const functionGroups = new Map<string, { label: string; answers: Answer[] }>()
  for (const answer of allAnswers) {
    const rawSession = sessionById.get((answer as Answer & { sessao_id: string }).sessao_id)
    const key = normalize(rawSession?.grupo) || '__sem_funcao__'
    const current = functionGroups.get(key) ?? { label: rawSession?.grupo?.trim() || 'Sem função informada', answers: [] }
    current.answers.push(answer)
    functionGroups.set(key, current)
  }

  const visibleFunctions = [...functionGroups.values()].filter((group) => group.answers.length >= 3)
  const otherAnswers = [...functionGroups.values()].filter((group) => group.answers.length < 3).flatMap((group) => group.answers)
  if (otherAnswers.length >= 3) visibleFunctions.push({ label: 'Outras funções', answers: otherAnswers })

  const questions = dimensoes.flatMap(([dimension, items]) => items.map((question) => ({ dimension, question })))
  const calculateAverages = (source: Answer[]) => questions.map((item, index) => {
    const values = source.map((answer) => Number(answer.respostas[String(index)])).filter(Number.isFinite)
    return { ...item, average: values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0 }
  })
  const aggregate = (source: Answer[]) => {
    const averages = calculateAverages(source)
    const dimensions = dimensoes.map(([name, items], dimensionIndex) => {
      const values = averages.slice(dimensionIndex * items.length, (dimensionIndex + 1) * items.length).map((item) => item.average).filter((value) => value > 0)
      return { name, average: values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)) : 0 }
    })
    return { total: source.length, averages, dimensions, comments: source.map((answer) => answer.comentario?.trim()).filter((comment): comment is string => Boolean(comment)) }
  }

  if (total < 3) return NextResponse.json({ available: false, session: { ...anchor, empresa: anchor.empresa.trim() }, total, minimum: 3, missing: 3 - total })
  return NextResponse.json({ available: true, session: { ...anchor, empresa: anchor.empresa.trim(), grupo: null }, total, totalItens, ...aggregate(allAnswers), functions: visibleFunctions.map((group) => ({ name: group.label, ...aggregate(group.answers) })) })
}
