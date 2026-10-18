import { NextResponse } from 'next/server'
import { db } from '@/lib/kp/db'

const DEFAULT_PESOS = { com: 2, eq: 2, resp: 2, prob: 2, adap: 2, cli: 2 }

export async function POST(req: Request) {
  try {
    const b = await req.json()
    if (b.website) return NextResponse.json({ error: 'Não foi possível enviar.' }, { status: 400 })
    if (!b.termos) return NextResponse.json({ error: 'Aceite dos termos é obrigatório.' }, { status: 400 })

    const { error } = await db.from('kp_vagas').insert({
      titulo: b.cargo,
      empresa: b.empresa || null,
      descricao: b.descricao,
      requisitos: b.requisitos,
      cidade: b.cidade,
      contratacao: b.contratacao,
      origem: 'empresa',
      status: 'pendente',
      publica: false,
      pesos: b.pesos ?? DEFAULT_PESOS,
      contato: { cnpj: b.cnpj || '', responsavel: b.responsavel, email: b.email, telefone: b.telefone, faixa: b.faixa || '' },
    })
    if (error) {
      console.error('[kp/anuncios] insert failed', error)
      return NextResponse.json({ error: 'Não foi possível enviar. Tente novamente.' }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[kp/anuncios] request failed', error)
    return NextResponse.json({ error: 'Não foi possível enviar. Tente novamente.' }, { status: 500 })
  }
}
