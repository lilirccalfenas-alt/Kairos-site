import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react'
import { getWhatsappLink, solutionDetails, solutionSlugs } from '@/lib/site-data'

export function generateStaticParams() {
  return solutionSlugs.map(({ slug }) => ({ slug }))
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const solution = solutionDetails.find((item) => item.slug === slug)

  if (!solution) {
    return <main className="detail-page"><div className="container detail-empty"><h1>Solução não encontrada</h1><Link className="button button-navy" href="/#solucoes">Voltar para soluções</Link></div></main>
  }

  const whatsapp = getWhatsappLink(`Olá! Gostaria de falar sobre a solução ${solution.title} da Kairós.`)

  return <main className="detail-page">
    <header className="detail-header"><div className="container detail-header-inner"><Link className="detail-back" href="/#solucoes"><ArrowLeft size={16} /> Todas as soluções</Link><span>Kairós Gestão e Liderança</span></div></header>
    <section className="detail-hero"><div className="container detail-hero-inner"><span className="eyebrow">Solução Kairós</span>{'comingSoon' in solution && solution.comingSoon && <span className="coming-soon">Em breve</span>}<h1>{solution.title}</h1><p>{solution.description}</p><a className="button button-gold" href={whatsapp} target="_blank" rel="noreferrer">Falar sobre esta solução <MessageCircle size={17} /></a></div></section>
    <section className="section detail-benefits"><div className="container detail-benefits-inner"><div><span className="eyebrow">Na prática</span><h2>Uma solução para o seu momento.</h2><p>Conheça os recursos e converse com a Kairós para entender como esta solução pode se aplicar à sua empresa.</p></div><ul>{solution.benefits.map((benefit) => <li key={benefit}><Check size={17} />{benefit}</li>)}</ul></div></section>
    <section className="detail-footer"><div className="container detail-footer-inner"><p>Quer entender como essa solução se aplica ao seu momento?</p><a className="button button-gold" href={whatsapp} target="_blank" rel="noreferrer">Falar sobre esta solução <ArrowRight size={16} /></a><Link className="detail-back detail-back-bottom" href="/#solucoes"><ArrowLeft size={16} /> Voltar às soluções</Link></div></section>
  </main>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const solution = solutionDetails.find((item) => item.slug === slug)
  return { title: solution ? `${solution.title} em Alfenas e Sul de Minas | Kairós` : 'Solução de RH em Alfenas | Kairós', description: solution ? `${solution.description} Atendimento em Alfenas, Sul de Minas, Minas Gerais e online.` : 'Soluções de gestão de pessoas da Kairós Gestão e Liderança.' }
}

void solutionSlugs
void getWhatsappLink
