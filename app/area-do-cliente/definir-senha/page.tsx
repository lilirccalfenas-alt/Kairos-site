'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

function DefinePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)
  const [expired, setExpired] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const client = createClient()
    let active = true
    const code = searchParams.get('code')

    const establishSession = async () => {
      if (code) {
        const { error: exchangeError } = await client.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          if (active) setExpired(true)
          return
        }
      }
      const { data } = await client.auth.getSession()
      if (!active) return
      if (data.session?.user) {
        setEmail(data.session.user.email || '')
        setReady(true)
      } else {
        setExpired(true)
      }
    }

    establishSession()
    const { data: listener } = client.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (!active) return
      if (session?.user) {
        setEmail(session.user.email || '')
        setReady(true)
        setExpired(false)
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [searchParams])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.')
    if (password !== confirmation) return setError('As senhas não conferem.')
    const { error: updateError } = await createClient().auth.updateUser({ password })
    if (updateError) return setError('Não foi possível salvar a senha. Solicite um novo link.')
    setMessage('Senha definida com sucesso. Redirecionando para o portal…')
    setTimeout(() => router.replace('/area-do-cliente'), 700)
  }

  async function requestNewLink() {
    setError('')
    setMessage('')
    if (!email) return setError('Informe o e-mail para receber um novo link.')
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/area-do-cliente/definir-senha` })
    if (resetError) return setError('Não foi possível enviar o novo link. Tente novamente.')
    setMessage('Se o e-mail estiver cadastrado, enviaremos um novo link.')
  }

  return <main className="portal-login"><div className="portal-login-card"><Link href="/area-do-cliente/login" className="portal-back">← Voltar ao login</Link><div className="portal-mark"><span>k</span><div><strong>Kairós</strong><small>Gestão e Liderança</small></div></div><span className="portal-eyebrow">Primeiro acesso</span><h1>{expired ? 'Link expirado ou já usado' : 'Defina sua senha'}</h1>{expired ? <><p>Este link não está mais válido. Informe seu e-mail para receber uma nova mensagem segura.</p><form onSubmit={event => { event.preventDefault(); requestNewLink() }}><label>E-mail<input type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>{error && <p className="portal-error">{error}</p>}{message && <p className="portal-success">{message}</p>}<button className="portal-primary">Receber novo link</button></form></> : <form onSubmit={submit}><p>Crie uma senha com pelo menos 8 caracteres para acessar a sua área.</p><label>Nova senha<input type="password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} /></label><label>Confirme sua senha<input type="password" minLength={8} required value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>{error && <p className="portal-error">{error}</p>}{message && <p className="portal-success">{message}</p>}<button className="portal-primary" disabled={!ready}>{ready ? 'Salvar senha' : 'Validando link…'}</button></form>}</div></main>
}

export default function DefinePasswordPage() { return <Suspense fallback={<main className="portal-login"><div className="portal-login-card"><p>Validando link seguro…</p></div></main>}><DefinePasswordForm /></Suspense> }
