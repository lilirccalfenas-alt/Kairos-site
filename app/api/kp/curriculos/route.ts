import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { db } from '@/lib/kp/db'

const CURRICULOS_BUCKET = 'curriculos'
const MAX_BYTES = 3 * 1024 * 1024
const ALLOWED_EXT = ['pdf', 'doc', 'docx']

const text = (v: FormDataEntryValue | null) => String(v ?? '').trim()

export async function POST(req: NextRequest) {
  const fd = await req.formData()

  // Campo isca anti-robô: se vier preenchido, finge sucesso e ignora
  if (text(fd.get('website'))) return NextResponse.json({ ok: true })

  const email = text(fd.get('email')).toLowerCase()
  const nome = text(fd.get('nome'))
  if (!email || !nome || fd.get('lgpd') !== 'on') {
    return NextResponse.json({ error: 'Dados obrigatórios' }, { status: 400 })
  }

  const raw = fd.get('arquivo')
  const file = raw instanceof File && raw.size > 0 ? raw : null

  let ext = ''
  if (file) {
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Arquivo excede 3 MB' }, { status: 400 })
    }
    ext = file.name.toLowerCase().split('.').pop() || ''
    if (!ALLOWED_EXT.includes(ext)) {
      return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
    }
  }

  // Arquivo do envio anterior deste e-mail (para apagar se for substituído)
  const { data: previous } = await db
    .from('kp_curriculos')
    .select('arquivo_path')
    .eq('email', email)
    .maybeSingle()

  // 1) Upload do novo arquivo
  let newPath: string | null = null
  if (file) {
    newPath = `${crypto.randomUUID()}.${ext}`
    const up = await db.storage
      .from(CURRICULOS_BUCKET)
      .upload(newPath, await file.arrayBuffer(), {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })
    if (up.error) {
      return NextResponse.json({ error: 'Falha no arquivo' }, { status: 500 })
    }
  }

  // 2) Grava o registro. Sem arquivo novo, mantém o arquivo anterior.
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim()
  const payload = {
    nome,
    email,
    telefone: text(fd.get('telefone')),
    cidade: text(fd.get('cidade')),
    area: text(fd.get('area')),
    escolaridade: text(fd.get('escolaridade')),
    resumo: text(fd.get('resumo')),
    ...(file
      ? {
          arquivo_path: newPath,
          arquivo_nome: file.name,
          arquivo_tipo: file.type,
          arquivo_tamanho: file.size,
        }
      : {}),
    aceita_lgpd: true,
    autoriza_parceiros: fd.get('parceiros') === 'on',
    ip_hash: crypto
      .createHash('sha256')
      .update((process.env.IP_HASH_SALT || '') + ip)
      .digest('hex'),
  }

  const { error } = await db.from('kp_curriculos').upsert(payload, { onConflict: 'email' })

  // 3) Rollback: se falhou ao gravar, apaga o arquivo recém-enviado
  if (error) {
    if (newPath) await db.storage.from(CURRICULOS_BUCKET).remove([newPath])
    return NextResponse.json({ error: 'Falha ao salvar' }, { status: 500 })
  }

  // 4) Apaga o arquivo antigo que foi substituído (não bloqueia o sucesso se falhar)
  if (newPath && previous?.arquivo_path && previous.arquivo_path !== newPath) {
    await db.storage.from(CURRICULOS_BUCKET).remove([previous.arquivo_path]).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}