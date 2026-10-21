import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

async function consultora() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, profile: null }
  const { data: profile } = await supabase.from('perfis').select('papel').eq('id', user.id).maybeSingle()
  return { supabase, user, profile }
}

export async function POST(request: Request) {
  const { user, profile } = await consultora()
  if (!user || profile?.papel !== 'consultora') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  const body = await request.json()
  const admin = getSupabaseAdmin()
  try {
    if (body.action === 'create_company') {
      const { data, error } = await admin.from('empresas').insert({ nome: body.nome, plano: body.plano, ativa: true }).select('id,nome,plano,ativa').single()
      if (error) throw error
      return NextResponse.json({ data })
    }
    if (body.action === 'update_company') {
      const { data, error } = await admin.from('empresas').update({ nome: body.nome, plano: body.plano, ativa: body.ativa }).eq('id', body.id).select('id,nome,plano,ativa').single()
      if (error) throw error
      return NextResponse.json({ data })
    }
    if (body.action === 'create_user') {
      const { data: created, error: authError } = await admin.auth.admin.createUser({ email: body.email, password: body.password, email_confirm: true })
      if (authError || !created.user) throw authError || new Error('Usuário não criado')
      const { data: profileData, error } = await admin.from('perfis').insert({ id: created.user.id, empresa_id: body.empresa_id, papel: 'cliente', nome: body.nome }).select('id,nome,empresa_id,papel').single()
      if (error) { await admin.auth.admin.deleteUser(created.user.id); throw error }
      return NextResponse.json({ data: profileData })
    }
    if (body.action === 'update_contact') {
      const { data, error } = await admin.from('site_contatos').update({ status: body.status }).eq('id', body.id).select('id,status').single()
      if (error) throw error
      return NextResponse.json({ data })
    }
    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    console.error('[kp] mutation failed', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erro interno' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { user, profile } = await consultora()
  if (!user || profile?.papel !== 'consultora') return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  const form = await request.formData()
  const file = form.get('file')
  const empresaId = String(form.get('empresa_id') || '')
  const titulo = String(form.get('titulo') || '')
  if (!(file instanceof File) || !empresaId || !titulo) return NextResponse.json({ error: 'Arquivo, empresa e título são obrigatórios' }, { status: 400 })
  const admin = getSupabaseAdmin()
  const path = `${empresaId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const { error: uploadError } = await admin.storage.from('documentos-clientes').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type || 'application/octet-stream', upsert: false })
  if (uploadError) { console.error('[kp] storage upload failed', uploadError); return NextResponse.json({ error: uploadError.message }, { status: 500 }) }
  const { data, error } = await admin.from('documentos').insert({ empresa_id: empresaId, titulo, storage_path: path, uploaded_by: user.id }).select('id,titulo,storage_path,data_upload').single()
  if (error) { await admin.storage.from('documentos-clientes').remove([path]); console.error('[kp] document insert failed', error); return NextResponse.json({ error: error.message }, { status: 500 }) }
  return NextResponse.json({ data })
}
