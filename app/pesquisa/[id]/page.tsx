import { notFound } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import { PesquisaForm } from '@/components/pesquisa-form'

export default async function PesquisaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data, error } = await getSupabase().from('sessoes').select('id, empresa, grupo, aberta').eq('id', id).maybeSingle()
  if (error || !data || !data.aberta) notFound()
  return <PesquisaForm id={data.id} empresa={data.empresa} grupo={data.grupo} />
}
