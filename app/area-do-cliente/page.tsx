import { redirect } from 'next/navigation'
import ClientPortal from '@/components/client/ClientPortal'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Área do Cliente', description: 'Acompanhe seus indicadores, colaboradores e desenvolvimento com a Kairós Gestão e Liderança.' }

export default async function AreaDoClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/area-do-cliente/login')
  const { data: profile } = await supabase.from('perfis').select('id, nome, papel, empresa_id, empresas(nome, plano, ativa)').eq('id', user.id).maybeSingle()
  const company = profile?.empresas && (Array.isArray(profile.empresas) ? profile.empresas[0] : profile.empresas)
  if (!profile || profile.papel !== 'cliente' || !company?.ativa) redirect('/area-do-cliente/login')
  const [collaborators, onboarding, climate, notices, evaluations, documents] = await Promise.all([
    supabase.from('colaboradores').select('id, nome, area_cargo, data_cadastro').eq('empresa_id', profile.empresa_id).order('nome'),
    supabase.from('onboarding_progresso').select('id, colaborador_id, etapa, concluida'),
    supabase.from('clima_respostas').select('id, nota_1, nota_2, nota_3, data_resposta').eq('empresa_id', profile.empresa_id),
    supabase.from('comunicados').select('id, titulo, texto, data_publicacao').eq('empresa_id', profile.empresa_id).order('data_publicacao', { ascending: false }),
    supabase.from('avaliacoes').select('id, tipo, texto, progresso, data_avaliacao, colaboradores(nome)').order('data_avaliacao', { ascending: false }),
    supabase.from('documentos').select('id, titulo, storage_path, data_upload').eq('empresa_id', profile.empresa_id).order('data_upload', { ascending: false }),
  ])
  const realData = { collaborators: (collaborators.data || []).map(item => ({ id: item.id, name: item.nome, role: item.area_cargo, area: item.area_cargo, onboarding: 0 })), notices: (notices.data || []).map(item => ({ id: item.id, title: item.titulo, text: item.texto, date: new Date(item.data_publicacao).toLocaleDateString('pt-BR') })), development: (evaluations.data || []).map(item => ({ id: item.id, collaborator: ((item.colaboradores as unknown as { nome?: string } | { nome?: string }[]) instanceof Array ? (item.colaboradores as unknown as { nome?: string }[])[0]?.nome : (item.colaboradores as unknown as { nome?: string })?.nome) || '', type: item.tipo, text: item.texto, progress: item.progresso })), onboarding: (onboarding.data || []).map(item => ({ id: item.id, collaborator_id: item.colaborador_id, etapa: item.etapa, concluida: item.concluida })), climate: climate.data || [], documents: (documents.data || []).map(item => ({ id: item.id, title: item.titulo, storage_path: item.storage_path, date: new Date(item.data_upload).toLocaleDateString('pt-BR') })), companyId: profile.empresa_id }
  return <ClientPortal initialAuthenticated initialProfile={{ name: profile.nome, company: company.nome, plan: company.plano }} initialData={realData} />
}
