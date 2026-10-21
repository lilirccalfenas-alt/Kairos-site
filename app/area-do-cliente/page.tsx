import { redirect } from 'next/navigation'
import ClientPortal from '@/components/client/ClientPortal'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Área do Cliente', description: 'Acompanhe seus indicadores, colaboradores e desenvolvimento com a Kairós Gestão e Liderança.' }

export default async function AreaDoClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/area-do-cliente/login')
  const { data: profile } = await supabase.from('perfis').select('id, nome, papel, empresas(nome, plano, ativa)').eq('id', user.id).maybeSingle()
  const company = profile?.empresas && (Array.isArray(profile.empresas) ? profile.empresas[0] : profile.empresas)
  if (!profile || profile.papel !== 'cliente' || !company?.ativa) redirect('/area-do-cliente/login')
  return <ClientPortal initialAuthenticated initialProfile={{ name: profile.nome, company: company.nome, plan: company.plano }} />
}
