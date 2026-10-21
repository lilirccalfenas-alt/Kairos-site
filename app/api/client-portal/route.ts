import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { data: profile } = await supabase.from('perfis').select('empresa_id, papel, nome, empresas(nome, plano, ativa)').eq('id', user.id).maybeSingle()
  if (!profile || !profile.empresas) return NextResponse.json({ error: 'Perfil não configurado' }, { status: 403 })
  const company = Array.isArray(profile.empresas) ? profile.empresas[0] : profile.empresas
  if (!company?.ativa) return NextResponse.json({ error: 'Empresa inativa' }, { status: 403 })
  const [collaborators, onboarding, climate, notices, evaluations, documents] = await Promise.all([
    supabase.from('colaboradores').select('id, nome, area_cargo, data_cadastro').eq('empresa_id', profile.empresa_id).order('nome'),
    supabase.from('onboarding_progresso').select('id, colaborador_id, etapa, concluida').in('colaborador_id', (await supabase.from('colaboradores').select('id').eq('empresa_id', profile.empresa_id)).data?.map(row => row.id) || []),
    supabase.from('clima_respostas').select('id, nota_1, nota_2, nota_3, data_resposta').eq('empresa_id', profile.empresa_id).order('data_resposta', { ascending: false }),
    supabase.from('comunicados').select('id, titulo, texto, data_publicacao').eq('empresa_id', profile.empresa_id).order('data_publicacao', { ascending: false }),
    supabase.from('avaliacoes').select('id, colaborador_id, tipo, texto, progresso, data_avaliacao, colaboradores(nome)').eq('colaboradores.empresa_id', profile.empresa_id).order('data_avaliacao', { ascending: false }),
    supabase.from('documentos').select('id, titulo, storage_path, data_upload').eq('empresa_id', profile.empresa_id).order('data_upload', { ascending: false }),
  ])
  const error = [collaborators, onboarding, climate, notices, evaluations, documents].find(result => result.error)?.error
  if (error) { console.error('[client-portal] GET failed', error); return NextResponse.json({ error: 'Falha ao carregar dados' }, { status: 500 }) }
  return NextResponse.json({ profile: { name: profile.nome, company: company.nome, plan: company.plano, companyId: profile.empresa_id, role: profile.papel }, collaborators: collaborators.data || [], onboarding: onboarding.data || [], climate: climate.data || [], notices: notices.data || [], evaluations: evaluations.data || [], documents: documents.data || [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await request.json() as { action?: string; payload?: Record<string, unknown> }
  const { data: profile } = await supabase.from('perfis').select('empresa_id, papel, empresas(plano, ativa)').eq('id', user.id).maybeSingle()
  const company = profile?.empresas && (Array.isArray(profile.empresas) ? profile.empresas[0] : profile.empresas)
  if (!profile || !company?.ativa) return NextResponse.json({ error: 'Perfil não configurado' }, { status: 403 })
  const payload = body.payload || {}
  let result
  if (body.action === 'create_collaborator') result = await supabase.from('colaboradores').insert({ empresa_id: profile.empresa_id, nome: payload.nome, area_cargo: payload.area_cargo, created_by: user.id }).select().single()
  else if (body.action === 'delete_collaborator') result = await supabase.from('colaboradores').delete().eq('id', payload.id as string).select().single()
  else if (body.action === 'create_notice') result = await supabase.from('comunicados').insert({ empresa_id: profile.empresa_id, titulo: payload.titulo, texto: payload.texto, created_by: user.id }).select().single()
  else if (body.action === 'submit_climate') result = await supabase.from('clima_respostas').insert({ empresa_id: profile.empresa_id, nota_1: payload.nota_1, nota_2: payload.nota_2, nota_3: payload.nota_3 }).select('id, data_resposta').single()
  else if (body.action === 'create_evaluation') { const collaborator = await supabase.from('colaboradores').select('id').eq('empresa_id', profile.empresa_id).eq('nome', payload.colaborador_id as string).maybeSingle(); result = collaborator.data ? await supabase.from('avaliacoes').insert({ colaborador_id: collaborator.data.id, tipo: payload.tipo, texto: payload.texto, progresso: payload.progresso || 0, created_by: user.id }).select().single() : { data: null, error: { message: 'Colaborador não encontrado' } } }
  else return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  if (result.error) { console.error('[client-portal] mutation failed', { action: body.action, error: result.error }); return NextResponse.json({ error: result.error.message }, { status: 400 }) }
  return NextResponse.json({ data: result.data })
}
