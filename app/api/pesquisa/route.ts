import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const empresa = typeof body.empresa === 'string' ? body.empresa.trim().slice(0, 120) : ''
    const grupo = typeof body.grupo === 'string' ? body.grupo.trim().slice(0, 120) : null
    if (!empresa) return NextResponse.json({ error: 'Informe a empresa.' }, { status: 400 })
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.from('sessoes').insert({ empresa, grupo, tipo: 'clima' }).select('id').single()
    if (error) return NextResponse.json({ error: 'Não foi possível criar a pesquisa.' }, { status: 500 })
    return NextResponse.json({ id: data.id })
  } catch {
    return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 })
  }
}
