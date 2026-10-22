import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

async function requireConsultora() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('perfis').select('papel').eq('id', user.id).maybeSingle()
  return profile?.papel === 'consultora' ? { user, admin: getSupabaseAdmin() } : null
}

async function audit(admin: ReturnType<typeof getSupabaseAdmin>, actorId: string, acao: string, empresaId?: string, alvoUserId?: string, detalhes: Record<string, unknown> = {}) {
  await admin.from('kp_auditoria').insert({ actor_id: actorId, acao, empresa_id: empresaId || null, alvo_user_id: alvoUserId || null, detalhes })
}

export async function POST(request: Request) {
  const context = await requireConsultora()
  if (!context) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  const { user, admin } = context
  const body = await request.json()
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin}/area-do-cliente/definir-senha`
  try {
    if (body.action === 'create_client') {
      const nome = String(body.nome || '').trim(); const plano = String(body.plano || '').trim(); const responsavel = String(body.responsavel || '').trim(); const email = String(body.email || '').trim().toLowerCase()
      if (!nome || !responsavel || !email || !['essencial', 'evolucao', 'transformacao'].includes(plano)) return NextResponse.json({ error: 'Preencha empresa, plano, responsável e e-mail.' }, { status: 400 })
      const { data: company, error: companyError } = await admin.from('empresas').insert({ nome, plano, ativa: true }).select('id,nome,plano,ativa,created_at').single()
      if (companyError) throw companyError
      const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, { data: { nome: responsavel }, redirectTo })
      if (inviteError || !invited.user) { await admin.from('empresas').delete().eq('id', company.id); throw inviteError || new Error('Convite não enviado') }
      const { error: profileError } = await admin.from('perfis').insert({ id: invited.user.id, empresa_id: company.id, papel: 'cliente', nome: responsavel })
      if (profileError) { await admin.auth.admin.deleteUser(invited.user.id); await admin.from('empresas').delete().eq('id', company.id); throw profileError }
      await audit(admin, user.id, 'cliente_criado', company.id, invited.user.id, { nome, plano, responsavel, email })
      await audit(admin, user.id, 'convite_enviado', company.id, invited.user.id, { email, tipo: 'inicial' })
      return NextResponse.json({ data: company, message: 'Cliente criado e convite enviado por e-mail.' })
    }
    if (body.action === 'update_company') {
      const { data: before } = await admin.from('empresas').select('id,nome,plano,ativa').eq('id', body.id).single()
      const { data, error } = await admin.from('empresas').update({ nome: body.nome, plano: body.plano, ativa: body.ativa }).eq('id', body.id).select('id,nome,plano,ativa,created_at').single()
      if (error) throw error
      if (before?.plano !== data.plano) await audit(admin, user.id, 'plano_alterado', data.id, undefined, { de: before?.plano, para: data.plano })
      if (before?.ativa !== data.ativa) await audit(admin, user.id, data.ativa ? 'empresa_ativada' : 'empresa_desativada', data.id, undefined, { nome: data.nome })
      return NextResponse.json({ data })
    }
    if (body.action === 'resend_invite' || body.action === 'reset_access') {
      const { data: profile } = await admin.from('perfis').select('id,empresa_id,nome').eq('empresa_id', body.empresa_id).eq('papel', 'cliente').maybeSingle()
      if (!profile) throw new Error('Nenhum usuário cliente encontrado para esta empresa.')
      const { data: authUser } = await admin.auth.admin.getUserById(profile.id)
      if (!authUser.user?.email) throw new Error('O usuário não possui e-mail.')
      const { error } = await (await createClient()).auth.resetPasswordForEmail(authUser.user.email, { redirectTo })
      if (error) throw error
      await audit(admin, user.id, body.action === 'reset_access' ? 'acesso_redefinido' : 'convite_enviado', body.empresa_id, profile.id, { email: authUser.user.email })
      return NextResponse.json({ data: { message: body.action === 'reset_access' ? 'E-mail para redefinição de acesso enviado.' : 'Convite reenviado.' } })
    }
    if (body.action === 'update_contact') {
      const { data, error } = await admin.from('site_contatos').update({ status: body.status }).eq('id', body.id).select('id,status').single()
      if (error) throw error
      return NextResponse.json({ data })
    }
    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
  } catch (error) {
    console.error('[kp] mutation failed', error)
    const message = error instanceof Error && /already|duplicate|exists/i.test(error.message) ? 'Este e-mail já está cadastrado.' : error instanceof Error ? error.message : 'Não foi possível concluir a ação.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const context = await requireConsultora()
  if (!context) return NextResponse.json({ error: 'Não autorizado' }, { status: 403 })
  const form = await request.formData(); const file = form.get('file'); const empresaId = String(form.get('empresa_id') || ''); const titulo = String(form.get('titulo') || '')
  if (!(file instanceof File) || !empresaId || !titulo) return NextResponse.json({ error: 'Arquivo, empresa e título são obrigatórios' }, { status: 400 })
  const path = `${empresaId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
  const { error: uploadError } = await context.admin.storage.from('documentos-clientes').upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type || 'application/octet-stream', upsert: false })
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 })
  const { data, error } = await context.admin.from('documentos').insert({ empresa_id: empresaId, titulo, storage_path: path, uploaded_by: context.user.id }).select('id,titulo,storage_path,data_upload').single()
  if (error) { await context.admin.storage.from('documentos-clientes').remove([path]); return NextResponse.json({ error: error.message }, { status: 500 }) }
  return NextResponse.json({ data })
}
