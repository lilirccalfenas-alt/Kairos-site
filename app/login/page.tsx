import { Suspense } from 'react'
import LoginForm from './login-form'

export default function LoginPage() {
  return <main className="survey-admin"><div className="survey-admin-inner login-page"><span className="survey-eyebrow">Kairós · Área interna</span><h1>Acesse suas pesquisas.</h1><p>Entre com seu e-mail e senha para acompanhar pesquisas e resultados.</p><Suspense fallback={<div className="survey-admin-card" aria-busy="true">Carregando acesso...</div>}><LoginForm /></Suspense></div></main>
}
