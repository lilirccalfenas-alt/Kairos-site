import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import KpDashboard from '@/components/kp/KpDashboard'

export default async function Kp() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/area-do-cliente/login')
  const { data: profile } = await supabase.from('perfis').select('papel').eq('id', user.id).maybeSingle()
  if (profile?.papel !== 'consultora') redirect('/area-do-cliente')
  const [{ data: contacts }, { data: companies }] = await Promise.all([
    supabase.from('site_contatos').select('id,nome,empresa,email,telefone,status,created_at').order('created_at', { ascending: false }),
    supabase.from('empresas').select('id,nome,plano,ativa,created_at').order('nome'),
  ])
  const companyList = companies || []
  const indicators = await Promise.all(companyList.map(async company => {
    const [{ count: colaboradores }, { count: comunicados }, { count: avaliacoes }] = await Promise.all([
      supabase.from('colaboradores').select('id', { count: 'exact', head: true }).eq('empresa_id', company.id),
      supabase.from('comunicados').select('id', { count: 'exact', head: true }).eq('empresa_id', company.id),
      supabase.from('avaliacoes').select('id', { count: 'exact', head: true }).in('colaborador_id', (await supabase.from('colaboradores').select('id').eq('empresa_id', company.id)).data?.map(item => item.id) || ['00000000-0000-0000-0000-000000000000']),
    ])
    return { id: company.id, nome: company.nome, plano: company.plano, colaboradores: colaboradores || 0, comunicados: comunicados || 0, avaliacoes: avaliacoes || 0 }
  }))
  const companiesWithCounts = companyList.map(company => ({ ...company, colaboradores: indicators.find(item => item.id === company.id)?.colaboradores || 0 }))
  return <KpDashboard initialContacts={contacts || []} initialCompanies={companiesWithCounts} indicators={indicators} />
}
