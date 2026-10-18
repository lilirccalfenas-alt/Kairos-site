'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type Anuncio = { id: string; titulo: string; empresa: string; cidade: string; status: string; criado_em: string; descricao: string }

export default function Page() {
  const router = useRouter()
  const [items, setItems] = useState<Anuncio[]>([])
  const [tab, setTab] = useState<'pendentes' | 'todos'>('pendentes')
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [error, setError] = useState('')

  async function carregar() {
    setState('loading')
    try {
      const response = await fetch('/api/kp/painel/anuncios')
      if (response.status === 401) {
        router.replace('/kp/painel')
        return
      }
      const payload = await response.json()
      if (!response.ok || payload.error) throw new Error(payload.error || 'Não foi possível carregar os anúncios.')
      setItems(payload.data || [])
      setState('ready')
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Não foi possível carregar os anúncios.')
      setState('error')
    }
  }

  useEffect(() => { carregar() }, [])

  async function atualizar(id: string, status: string) {
    const response = await fetch('/api/kp/painel/anuncios', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    if (response.status === 401) return router.replace('/kp/painel')
    if (!response.ok) return setError('Não foi possível atualizar o anúncio.')
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item))
  }

  const visible = useMemo(() => tab === 'pendentes' ? items.filter((item) => item.status === 'pendente') : items, [items, tab])
  return <main className="kp-panel"><h1>Anúncios de vagas</h1><nav className="kp-tabs" aria-label="Filtro de anúncios"><button className={tab === 'pendentes' ? 'active' : ''} onClick={() => setTab('pendentes')}>Pendentes</button><button className={tab === 'todos' ? 'active' : ''} onClick={() => setTab('todos')}>Todos</button></nav>{state === 'loading' && <p>Carregando...</p>}{state === 'error' && <p className="kp-error" role="alert">{error}</p>}{state === 'ready' && visible.length === 0 && <p>Nenhum anúncio pendente</p>}{state === 'ready' && visible.map((item) => <article className="kp-card" key={item.id}><h2>{item.titulo}</h2><p>{item.empresa} · {item.cidade} · {new Date(item.criado_em).toLocaleDateString('pt-BR')}</p><p>{item.descricao}</p>{item.status === 'pendente' && <><button className="kp-secondary" onClick={() => setError('Edição rápida ainda não disponível para este anúncio.')}>Editar</button> <button className="kp-button" onClick={() => atualizar(item.id, 'publicada')}>Aprovar</button> <button className="kp-secondary" onClick={() => atualizar(item.id, 'recusada')}>Recusar</button></>}</article>)}</main>
}
