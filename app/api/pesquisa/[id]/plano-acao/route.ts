import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'
import { requireResearchUser } from '@/lib/research-auth'

type Params = { params: Promise<{ id: string }> }
const fields = ['problema', 'acao', 'responsavel', 'prazo', 'custo', 'status'] as const

export async function GET(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('planos_acao').select('id, sessao_id, problema, acao, responsavel, prazo, custo, status, created_at, updated_at').eq('sessao_id', id).order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: 'Não foi possível carregar o plano de ação. Execute o SQL fornecido no Supabase.' }, { status: 500 })
  return NextResponse.json({ plans: data ?? [] })
}

export async function POST(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const values = Object.fromEntries(fields.map((field) => [field, typeof body[field] === 'string' ? body[field].trim().slice(0, 1000) : '']))
  if (!values.problema || !values.acao) return NextResponse.json({ error: 'Informe o problema e a ação.' }, { status: 400 })
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('planos_acao').insert({ sessao_id: id, ...values }).select('id, sessao_id, problema, acao, responsavel, prazo, custo, status, created_at, updated_at').single()
  if (error) return NextResponse.json({ error: 'Não foi possível salvar o plano de ação. Execute o SQL fornecido no Supabase.' }, { status: 500 })
  return NextResponse.json({ plan: data })
}

export async function DELETE(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const planId = new URL(request.url).searchParams.get('id')
  if (!planId) return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 })
  const { error } = await getSupabaseAdmin().from('planos_acao').delete().eq('id', planId).eq('sessao_id', id)
  if (error) return NextResponse.json({ error: 'Não foi possível excluir o plano.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request, { params }: Params) {
  const access = await requireResearchUser(request)
  if (access.response) return access.response
  const { id } = await params
  const body = await request.json().catch(() => ({}))
  const planId = typeof body.id === 'string' ? body.id : ''
  if (!planId) return NextResponse.json({ error: 'Plano inválido.' }, { status: 400 })
  const values = Object.fromEntries(fields.filter((field) => typeof body[field] === 'string').map((field) => [field, body[field].trim().slice(0, 1000)]))
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase.from('planos_acao').update({ ...values, updated_at: new Date().toISOString() }).eq('id', planId).eq('sessao_id', id).select('id, sessao_id, problema, acao, responsavel, prazo, custo, status, created_at, updated_at').single()
  if (error) return NextResponse.json({ error: 'Não foi possível atualizar o plano de ação.' }, { status: 500 })
  return NextResponse.json({ plan: data })
}
