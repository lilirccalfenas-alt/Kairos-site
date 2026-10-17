import { redirect } from 'next/navigation'

export default async function RelatorioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(`/pesquisas/${id}/resultados`)
}
