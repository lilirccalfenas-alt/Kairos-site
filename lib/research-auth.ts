import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { getSupabaseAdmin } from '@/lib/supabase-admin'

export async function requireResearchUser(request: Request) {
  const authorization = request.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : ''
  if (!token) return { user: null, response: NextResponse.json({ error: 'Autenticação necessária.' }, { status: 401 }) }

  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return { user: null, response: NextResponse.json({ error: 'Sessão expirada. Faça login novamente.' }, { status: 401 }) }
  const admin = getSupabaseAdmin()
  const { data: profile, error: profileError } = await admin.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
  if (profileError || profile?.role !== 'admin') return { user: null, response: NextResponse.json({ error: 'Acesso restrito ao administrador.' }, { status: 403 }) }
  return { user: data.user, response: null }
}
