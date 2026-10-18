import { NextResponse } from 'next/server'
import { db } from '@/lib/kp/db'
import { currentClient } from '@/lib/kp/client-auth'
export async function GET() {
  const client = await currentClient()
  if (!client) return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  const [sessions, jobs] = await Promise.all([
    db.from('kp_sessoes').select('id,empresa,grupo,tipo,aberta,criado_em,expira_em,kp_respostas(count)').eq('cliente_id', client.id).order('criado_em', { ascending: false }),
    db.from('kp_vagas').select('id,titulo,empresa,status,publica,criado_em').eq('cliente_id', client.id).order('criado_em', { ascending: false }),
  ])
  return NextResponse.json({ client, sessions: sessions.data ?? [], jobs: jobs.data ?? [] })
}
