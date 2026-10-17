'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      if (data.session) router.replace(searchParams.get('next') || '/pesquisas')
    })
  }, [router, searchParams])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await getSupabase().auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message.toLowerCase().includes('email') || authError.message.toLowerCase().includes('password') ? 'E-mail ou senha inválidos.' : 'Não foi possível entrar agora.')
      return
    }
    router.replace(searchParams.get('next') || '/pesquisas')
  }

  return <main className="survey-admin"><div className="survey-admin-inner login-page"><span className="survey-eyebrow">Kairós · Área interna</span><h1>Acesse suas pesquisas.</h1><p>Entre com seu e-mail e senha para acompanhar pesquisas e resultados.</p><form className="survey-admin-card" onSubmit={submit}><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="survey-error">{error}</p>}<button className="button button-navy" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button></form></div></main>
}
