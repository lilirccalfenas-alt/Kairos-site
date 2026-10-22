'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/browser'

type Stage = 'start' | 'form' | 'expired'

function DefinePasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [stage, setStage] = useState<Stage>('start')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const errorCode = params.get('error_code')
    if (params.get('error') || errorCode === 'otp_expired' || errorCode === 'access_denied') {
      setError('Este link expirou ou já foi usado.')
      setStage('expired')
    }
  }, [])

  async function verifyInvite(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type') as 'invite' | 'recovery' | null
    if (!tokenHash || (type !== 'invite' && type !== 'recovery')) {
      setError('Este link expirou ou já foi usado.')
      setStage('expired')
      setBusy(false)
      return
    }
    const { data, error: verifyError } = await createClient().auth.verifyOtp({ token_hash: tokenHash, type })
    if (verifyError || !data.user) {
      setError('Este link expirou ou já foi usado.')
      setStage('expired')
    } else {
      setEmail(data.user.email || '')
      setStage('form')
    }
    setBusy(false)
  }

  async function requestNewLink(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email, { redirectTo: 'https://kairosrhgestao.com.br/area-do-cliente/definir-senha' })
    setMessage(resetError ? '' : 'Se o e-mail estiver cadastrado, enviaremos um novo link.')
    if (resetError) setError('Não foi possível enviar o novo link. Tente novamente.')
    setBusy(false)
  }

  async function submitPassword(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (password.length < 8) return setError('A senha precisa ter pelo menos 8 caracteres.')
    if (password !== confirmation) return setError('As senhas não conferem.')
    setBusy(true)
    const { error: updateError } = await createClient().auth.updateUser({ password })
    if (updateError) {
      setError('Não foi possível salvar a senha. Solicite um novo link.')
      setBusy(false)
      return
    }
    router.replace('/area-do-cliente')
    router.refresh()
  }

  return <main className="portal-login"><div className="portal-login-card"><Link href="/area-do-cliente/login" className="portal-back">← Voltar ao login</Link><div className="portal-mark"><span>k</span><div><strong>Kairós</strong><small>Gestão e Liderança</small></div></div><span className="portal-eyebrow">Acesso seguro</span>{stage === 'expired' ? <><h1>Este link expirou ou já foi usado.</h1><p>Informe seu e-mail para receber um novo link de acesso.</p><form onSubmit={requestNewLink}><label>E-mail<input type="email" required value={email} onChange={event => setEmail(event.target.value)} /></label>{error && <p className="portal-error">{error}</p>}{message && <p className="portal-success">{message}</p>}<button className="portal-primary" disabled={busy}>{busy ? 'Enviando…' : 'Receber novo link'}</button></form></> : stage === 'start' ? <><h1>Defina sua senha</h1><p>Quando estiver pronta, clique no botão abaixo para validar seu convite e criar sua senha.</p>{error && <p className="portal-error">{error}</p>}<form onSubmit={verifyInvite}><button className="portal-primary" disabled={busy}>{busy ? 'Validando link…' : 'Definir minha senha'}</button></form></> : <><h1>Defina sua senha</h1><p>Crie uma senha com pelo menos 8 caracteres para acessar sua área.</p><form onSubmit={submitPassword}><label>Nova senha<input type="password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} /></label><label>Confirme sua senha<input type="password" minLength={8} required value={confirmation} onChange={event => setConfirmation(event.target.value)} /></label>{error && <p className="portal-error">{error}</p>}<button className="portal-primary" disabled={busy}>{busy ? 'Salvando…' : 'Salvar senha'}</button></form></>}</div></main>
}

export default function DefinePasswordPage() { return <Suspense fallback={<main className="portal-login"><div className="portal-login-card"><p>Carregando acesso seguro…</p></div></main>}><DefinePasswordForm /></Suspense> }
