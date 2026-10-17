'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export default function LoginForm() {
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
      const message = authError.message.toLowerCase()
      setError(message.includes('email') || message.includes('password') ? 'E-mail ou senha inválidos.' : 'Não foi possível entrar agora.')
      return
    }
    router.replace(searchParams.get('next') || '/pesquisas')
  }

  return <form className="survey-admin-card" onSubmit={submit}><label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Senha<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="survey-error">{error}</p>}<button className="button button-navy" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button></form>
}
