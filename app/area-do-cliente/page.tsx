import { redirect } from 'next/navigation'
import ClientPortal from '@/components/client/ClientPortal'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Área do Cliente', description: 'Acompanhe seus indicadores, colaboradores e desenvolvimento com a Kairós Gestão e Liderança.' }

export default async function AreaDoClientePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/area-do-cliente/login')
  return <ClientPortal initialAuthenticated />
}
