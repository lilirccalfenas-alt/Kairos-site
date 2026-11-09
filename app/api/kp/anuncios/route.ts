import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { db } from '@/lib/kp/db'

const DEFAULT_PESOS = { com: 2, eq: 2, resp: 2, prob: 2, adap: 2, cli: 2 }

export async function POST(req: Request) {
  const ref = randomUUID()
  try {
    const b = await req.json()
    if (b.website) return NextResponse.json({ error: 'Não foi possível enviar.' }, { status: 400 })
    if (!b.termos) return NextResponse.json({ error: 'Aceite dos termos é obrigatório.' }, { status: 400 })
    const required = ['empresa', 'responsavel', 'email', 'telefone', 'cargo', 'cidade', 'contratacao', 'descricao', 'requisitos']
    if (required.some((key) => typeof b[key] !== 'string' || !b[key].trim())) {
      return NextResponse.json({ error: 'Preencha todos os campos obrigatórios.' }, { status: 400 })
    }

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
      console.error('[kp_vagas]', ref, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
      return NextResponse.json(
        { error: `Não foi possível registrar o anúncio. Informe esta referência à Kairós: ${ref}` },
        { status: 400 }
      )
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[kp/anuncios] request failed', { ref, message: error instanceof Error ? error.message : 'unknown error' })
    return NextResponse.json({ error: `Não foi possível registrar o anúncio. Informe esta referência à Kairós: ${ref}` }, { status: 500 })
  }
}
