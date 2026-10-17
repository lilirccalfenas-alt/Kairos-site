'use client'

import { useEffect, useState } from 'react'
import { ResearchAuthGate, getResearchAccessToken } from '@/components/research-auth-gate'

interface Session { id: string; empresa: string; grupo: string | null; criado_em: string; respostas: number; aberta: boolean }
const formatDate = (date: string) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(date))

export default function PesquisasPage() {
  const [empresa, setEmpresa] = useState('')
  const [grupo, setGrupo] = useState('')
  const [link, setLink] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [error, setError] = useState('')
  const load = async () => { const token = await getResearchAccessToken(); const response = await fetch('/api/pesquisa', { cache: 'no-store', headers: { Authorization: `Bearer ${token}` } }); const data = await response.json(); if (response.ok) setSessions(data.sessions) }
  useEffect(() => { void load() }, [])
  const create = async (event: React.FormEvent) => { event.preventDefault(); setError(''); const token = await getResearchAccessToken(); const response = await fetch('/api/pesquisa', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ empresa, grupo }) }); const data = await response.json(); if (!response.ok) return setError(data.error); const nextLink = `${window.location.origin}/pesquisa/${data.id}`; setLink(nextLink); setEmpresa(''); setGrupo(''); void load() }
  const copy = async (id: string) => { await navigator.clipboard.writeText(`${window.location.origin}/pesquisa/${id}`); setLink('Link copiado.') }
  return <ResearchAuthGate><main className="survey-admin"><div className="survey-admin-inner"><span className="survey-eyebrow">Kairós · Ferramenta interna</span><h1>Crie uma escuta que gera clareza.</h1><p>Gere um link de pesquisa de clima e riscos psicossociais para compartilhar com sua equipe.</p><form className="survey-admin-card" onSubmit={create}><label>Nome da empresa<input required value={empresa} onChange={(event) => setEmpresa(event.target.value)} placeholder="Ex.: Empresa Kairós" /></label><label>Grupo ou equipe <span>(opcional)</span><input value={grupo} onChange={(event) => setGrupo(event.target.value)} placeholder="Ex.: Administrativo" /></label><button className="button button-navy" type="submit">Gerar pesquisa</button>{error && <p className="survey-error">{error}</p>}</form>{link && <div className="survey-link"><strong>Pesquisa criada</strong><span>{link}</span><small>Copie o link e compartilhe com os participantes.</small></div>}
  <section className="survey-list"><div className="survey-list-heading"><div><span className="survey-eyebrow">Histórico</span><h2>Pesquisas criadas</h2></div><button className="button button-outline" type="button" onClick={() => void load()}>Atualizar</button></div>{sessions.length === 0 ? <p className="survey-empty">Nenhuma pesquisa criada ainda.</p> : <div className="survey-table">{sessions.map((session) => <article className="survey-row" key={session.id}><a href={`/pesquisas/${session.id}/resultados`}><strong>{session.empresa}</strong><span>{session.grupo || 'Todos os colaboradores'}</span></a><span>{formatDate(session.criado_em)}</span><span><b>{session.respostas}</b> resposta{session.respostas === 1 ? '' : 's'}</span><div className="survey-row-actions"><a className="button button-navy" href={`/pesquisas/${session.id}/resultados`}>Ver relatório</a><button className="button button-outline" type="button" onClick={() => void copy(session.id)}>Copiar link</button></div></article>)}</div>}</section></div></main></ResearchAuthGate>
}
