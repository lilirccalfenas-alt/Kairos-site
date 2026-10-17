'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { companyName, formattedWhatsappNumber, legalNotice, logoAlt } from '@/lib/site-data'

type Section = { title: string; paragraphs: string[] }

export function LegalPage({ title, updatedAt, sections }: { title: string; updatedAt: string; sections: Section[] }) {
  return <main className="detail-page legal-page">
    <header className="detail-header"><div className="container detail-header-inner"><Link className="detail-back" href="/"><ArrowLeft size={16} /> Voltar ao início</Link><Link className="legal-brand" href="/" aria-label={logoAlt}>{companyName}</Link></div></header>
    <section className="detail-hero legal-hero"><div className="container detail-hero-inner"><span className="eyebrow">Informações legais</span><h1>{title}</h1><p>Última atualização: {updatedAt}</p></div></section>
    <section className="section legal-content"><div className="container legal-content-inner"><div className="legal-notice">{legalNotice}</div>{sections.map((section) => <section className="legal-section" key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div></section>
    <footer><div className="container footer-bottom legal-footer"><span>© {new Date().getFullYear()} {companyName}. Todos os direitos reservados.</span><span><Link href="/privacidade">Privacidade</Link> · <Link href="/termos">Termos</Link> · <Link href="/cookies">Cookies</Link></span></div></footer>
  </main>
}

export const privacySections: Section[] = [
  { title: 'Quem somos', paragraphs: ['A Kairós Gestão e Liderança está localizada em Alfenas, MG, e oferece soluções de gestão de pessoas, desenvolvimento de lideranças e tecnologia para empresas.'] },
  { title: 'Quais dados coletamos', paragraphs: ['Podemos coletar nome, empresa, e-mail, telefone, número de colaboradores e a mensagem enviada nos formulários de contato.'] },
  { title: 'Para que usamos', paragraphs: ['Usamos esses dados para responder contatos, entender necessidades e apresentar propostas ou informações sobre nossos serviços.'] },
  { title: 'Base legal', paragraphs: ['O tratamento se baseia no consentimento do titular e, quando aplicável, no legítimo interesse para responder solicitações e manter o relacionamento comercial.'] },
  { title: 'Com quem compartilhamos', paragraphs: ['Compartilhamos dados apenas com fornecedores necessários à operação, como hospedagem e ferramentas de comunicação, sempre que necessário para prestar o serviço.'] },
  { title: 'Por quanto tempo guardamos', paragraphs: ['Mantemos os dados pelo tempo necessário para cumprir as finalidades informadas, obrigações legais e exercício regular de direitos. Depois, eliminamos ou anonimizamos os dados quando possível.'] },
  { title: 'Direitos do titular', paragraphs: ['Você pode solicitar acesso, correção, exclusão, portabilidade quando aplicável e revogação do consentimento, observadas as hipóteses legais de conservação.'] },
  { title: 'Cookies', paragraphs: ['Usamos cookies necessários para o funcionamento do site e podemos usar cookies de estatística quando essa funcionalidade estiver ativa. Consulte o Aviso de Cookies.'] },
  { title: 'Segurança', paragraphs: ['Adotamos medidas técnicas e administrativas razoáveis para proteger os dados contra acessos não autorizados, perda, alteração ou divulgação indevida.'] },
  { title: 'Contato do encarregado', paragraphs: ['Para dúvidas ou solicitações relacionadas a dados pessoais, entre em contato pelo WhatsApp: {formattedWhatsappNumber}. E-mail em breve.'] },
  { title: 'Atualizações da política', paragraphs: ['Esta política pode ser atualizada para refletir mudanças legais, operacionais ou tecnológicas. A data no topo indica a versão mais recente.'] },
]

export const termsSections: Section[] = [
  { title: 'Objeto do site', paragraphs: ['O site apresenta a Kairós Gestão e Liderança, seus serviços, soluções e canais de contato. As informações têm caráter institucional e comercial.'] },
  { title: 'Uso permitido', paragraphs: ['Use o site de forma lícita, respeitosa e compatível com sua finalidade. Não é permitido tentar comprometer sua segurança, copiar conteúdo de forma indevida ou utilizá-lo para finalidades ilícitas.'] },
  { title: 'Propriedade intelectual', paragraphs: ['Textos, marcas, imagens, layouts e demais elementos do site pertencem à Kairós ou a seus licenciadores e não podem ser reproduzidos sem autorização.'] },
  { title: 'Limitação de responsabilidade', paragraphs: ['Empregamos esforços para manter as informações atualizadas, mas não garantimos ausência de erros ou disponibilidade contínua. Propostas e condições dependem de análise específica.'] },
  { title: 'Links externos', paragraphs: ['O site pode conter links para serviços de terceiros. A Kairós não controla esses ambientes e não se responsabiliza por seus conteúdos ou práticas.'] },
  { title: 'Alterações', paragraphs: ['Podemos atualizar o site e estes termos a qualquer momento. A versão publicada nesta página será a vigente.'] },
  { title: 'Foro', paragraphs: ['Fica eleito o foro da Comarca de Alfenas, MG, salvo disposição legal em contrário.'] },
]

export const cookieSections: Section[] = [
  { title: 'O que são cookies', paragraphs: ['Cookies são pequenos arquivos armazenados no navegador para lembrar preferências e apoiar o funcionamento de um site.'] },
  { title: 'Quais usamos', paragraphs: ['Usamos cookies necessários, como o registro da escolha feita no aviso de cookies. Se ferramentas de estatística forem ativadas, poderão existir cookies de estatística descritos nesta página.'] },
  { title: 'Como desativar', paragraphs: ['Você pode apagar ou bloquear cookies nas configurações do seu navegador. Isso pode afetar algumas funcionalidades do site. Também é possível revisar a escolha limpando os dados do site no navegador.'] },
]
export const legalUpdatedAt = '14 de outubro de 2026'
void ArrowLeft
void Link
void companyName
void legalNotice
void logoAlt
void LegalPage
void privacySections
void termsSections
void cookieSections
void legalUpdatedAt
