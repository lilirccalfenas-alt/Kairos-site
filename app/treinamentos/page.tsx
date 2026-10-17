import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from 'lucide-react'
import { courses, getWhatsappLink, logoAlt } from '@/lib/site-data'

export const metadata: Metadata = {
  title: 'Treinamentos em Alfenas e Sul de Minas',
  description: 'Capacitações para líderes e equipes, presenciais em Alfenas e região ou online para empresas de Minas Gerais e do Brasil.',
}

export default function TreinamentosPage() {
  return <main className="detail-page courses-page">
    <header className="detail-header"><div className="container detail-header-inner"><a href="/" className="detail-back"><ArrowLeft size={16} /> Voltar para Kairós</a><span>{logoAlt}</span></div></header>
    <section className="detail-hero"><div className="container detail-hero-inner"><span className="eyebrow"><BookOpen size={15} /> Desenvolvimento</span><h1>Treinamentos</h1><p>Capacitações para líderes e equipes, presenciais em Alfenas e região ou online.</p></div></section>
    <section className="section courses-catalog"><div className="container"><div className="catalog-notice">Catálogo de exemplo. Os programas e cargas horárias serão confirmados conforme a necessidade de cada empresa.</div><div className="course-grid">{courses.map((course) => <article className="course-card" key={course.title}><span className="course-label">Exemplo</span><h2>{course.title}</h2><p>{course.description}</p><span className="course-modality"><Clock3 size={15} /> {course.modality}</span><a className="button button-navy" href={getWhatsappLink(`Olá! Quero saber mais sobre o treinamento ${course.title}.`)} target="_blank" rel="noreferrer">Quero saber mais <ArrowRight size={16} /></a></article>)}</div></div></section>
    <section className="section programs"><div className="container"><div className="section-title"><span>Do diagnóstico ao aprendizado</span><h2>Como funcionam os programas</h2></div><div className="program-steps"><div><strong>01</strong><h3>Conversamos sobre sua necessidade</h3><p>Entendemos o contexto da empresa, da equipe e os resultados desejados.</p></div><div><strong>02</strong><h3>Desenhamos o programa sob medida</h3><p>Definimos conteúdo, formato e carga horária adequados ao seu momento.</p></div><div><strong>03</strong><h3>Acompanhamos participação e aprendizado</h3><p>Observamos a participação e ajustamos o caminho para apoiar a aplicação.</p></div></div><p className="platform-note">Trilhas de aprendizagem, certificados e acompanhamento de progresso fazem parte da plataforma digital, em breve.</p></div></section>
  </main>
}
