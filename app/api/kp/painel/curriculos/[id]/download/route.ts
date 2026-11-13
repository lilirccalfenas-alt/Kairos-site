import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { db } from '@/lib/kp/db'
import { isAdmin } from '@/lib/kp/auth'

const CURRICULOS_BUCKET = 'curriculos'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin((await cookies()).get('kp_admin')?.value)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  const { data } = await db
    .from('kp_curriculos')
    .select('arquivo_path, arquivo_nome')
    .eq('id', id)
    .single()

  if (!data?.arquivo_path) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  }

  // Link assinado de 5 minutos; o arquivo baixa com o nome original
  const { data: url, error } = await db.storage
    .from(CURRICULOS_BUCKET)
    .createSignedUrl(data.arquivo_path, 300, { download: data.arquivo_nome || true })

  if (error || !url) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  }

  return NextResponse.redirect(url.signedUrl)
}