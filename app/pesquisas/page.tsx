'use client'

import { useState } from 'react'

export default function PesquisasPage() {
  const [empresa, setEmpresa] = useState('')
  const [grupo, setGrupo] = useState('')
  const [link, setLink] = useState('')
  const [error, setError] = useState('')
  const create = async (event: React.FormEvent) => { event.preventDefault(); setError(''); const response = await fetch('/api/pesquisa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empresa, grupo }) }); const data = await response.json(); if (!response.ok) return setError(data.error); setLink(`${window.location.origin}/pesquisa/${data.id}`) }
  return <main className="survey-admin"><div className="survey-admin-inner"><span className="survey-eyebrow">Kairós · Ferramenta interna</span><h1>Crie uma escuta que gera clareza.</h1><p>Gere um link de pesquisa de clima e riscos psicossociais para compartilhar com sua equipe.</p><form className="survey-admin-card" onSubmit={create}><label>Nome da empresa<input required value={empresa} onChange={(event) => setEmpresa(event.target.value)} placeholder="Ex.: Empresa Kairós" /></label><label>Grupo ou equipe <span>(opcional)</span><input value={grupo} onChange={(event) => setGrupo(event.target.value)} placeholder="Ex.: Administrativo" /></label><button className="button button-navy" type="submit">Gerar pesquisa</button>{error && <p className="survey-error">{error}</p>}</form>{link && <div className="survey-link"><strong>Pesquisa criada</strong><a href={link}>{link}</a><small>Copie o link e compartilhe com os participantes.</small></div>}</div></main>
}
