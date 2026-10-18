import { db } from '@/lib/kp/db'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Kairós | Vagas abertas' }
export default async function Page() {
  const { data } = await db.from('kp_vagas').select('id,titulo,empresa,cidade,contratacao,descricao,requisitos').eq('publica', true).eq('status', 'publicada').order('criado_em', { ascending: false })
  const vagas = data ?? []
  return <main className="kp-public"><header><strong>KAIRÓS</strong><span>Vagas abertas</span></header><div className="kp-wrap"><h1>O próximo passo pode começar aqui</h1><p className="kp-muted">Encontre oportunidades alinhadas ao seu momento.</p>{vagas.length === 0 ? <p className="kp-card">Nenhuma vaga aberta no momento.</p> : vagas.map((v) => <article className="kp-card" key={v.id}><h2>{v.titulo}</h2><p><b>{v.empresa || 'Empresa parceira'}</b> · {v.cidade || 'Local não informado'} · {v.contratacao || 'A combinar'}</p><p>{v.descricao}</p><a className="kp-button" href={`/kp/vaga/${v.id}`}>Candidatar-me</a><a className="kp-report" href={`mailto:contato@kairosgestao.com.br?subject=Denunciar vaga ${v.id}`}>Denunciar vaga</a></article>)}</div></main>
}
