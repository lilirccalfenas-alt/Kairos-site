import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react'
import { getWhatsappLink, logoAlt } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Área do Cliente | Kairós em Alfenas e Minas Gerais',
  description: 'Conheça a futura Área do Cliente da Kairós Gestão e Liderança para empresas de Alfenas, Sul de Minas e Minas Gerais.',
}

export default function AreaDoClientePage() {
  return <main className="detail-page client-page">
    <header className="detail-header"><div className="container detail-header-inner"><a href="/" className="detail-back"><ArrowLeft size={16} /> Voltar para Kairós</a><span>{logoAlt}</span></div></header>
    <section className="section client-login-section"><div className="container client-login-grid"><div className="client-login-copy"><span className="eyebrow"><LockKeyhole size={15} /> Área reservada</span><h1>Área do Cliente</h1><span className="coming-soon">Em breve</span><p>O portal da Kairós está em desenvolvimento. Quer conhecer em primeira mão? Solicite uma demonstração.</p><a className="button button-gold" href={getWhatsappLink('Olá! Gostaria de solicitar uma demonstração da Área do Cliente.')} target="_blank" rel="noreferrer">Solicitar demonstração <ArrowRight size={16} /></a></div><form className="client-login-card"><h2>Entrar no portal</h2><label>E-mail<input type="email" disabled placeholder="seu@email.com" /></label><label>Senha<input type="password" disabled placeholder="Sua senha" /></label><button className="button button-navy" type="button" disabled>Entrar</button><small>O acesso estará disponível em breve.</small></form></div></section>
  </main>
}
