import { ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { additionalServiceDetails, companyName, getWhatsappLink } from '@/lib/site-data'

export default function ServicesPage() {
  return <main className="detail-page">
    <header className="detail-header"><div className="container detail-header-inner"><Link className="detail-back" href="/#solucoes"><ArrowLeft size={16} /> Voltar ao início</Link><span>{companyName}</span></div></header>
    <section className="detail-hero"><div className="container detail-hero-inner"><span className="eyebrow">Além da plataforma</span><h1>Serviços adicionais para o seu momento</h1><p>Experiência e apoio sob medida para transformar os desafios de pessoas da sua empresa em caminhos possíveis.</p></div></section>
    <section className="section services-page-section"><div className="container"><div className="service-detail-grid">{additionalServiceDetails.map((service) => { const whatsapp = getWhatsappLink(`Olá! Gostaria de falar sobre o serviço ${service.title} da Kairós.`); return <article className="service-detail-card" key={service.slug}><span className="service-detail-mark">+</span><h2>{service.title}</h2><p>{service.description}</p><a className="button button-navy" href={whatsapp} target="_blank" rel="noreferrer">Falar sobre este serviço <MessageCircle size={16} /></a></article> })}</div></div></section>
    <section className="detail-footer"><div className="container detail-footer-inner"><p>Quer conversar sobre o que sua empresa precisa agora?</p><Link className="button button-light" href="/#contato">Ir para contato <ArrowRight size={16} /></Link></div></section>
  </main>
}

export const metadata = { title: 'Serviços adicionais de RH em Alfenas e Sul de Minas | Kairós', description: 'Consultoria, mentoria, treinamentos, diagnósticos e implantação de RH para empresas de Alfenas, Sul de Minas e Minas Gerais.' }
void ArrowRight
void getWhatsappLink
void additionalServiceDetails
void companyName
void ArrowLeft
void MessageCircle
void Link
void metadata
