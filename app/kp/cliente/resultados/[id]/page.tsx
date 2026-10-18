'use client'
import { useEffect, useState } from 'react'
import { ArrowLeft, BarChart3 } from 'lucide-react'
export default function ClienteResultadoPage({ params }: { params: Promise<{ id: string }> }) {
  const [data,setData]=useState<any>(null); const [error,setError]=useState('')
  useEffect(()=>{ void params.then(({id})=>fetch(`/api/kp/cliente/resultados?id=${id}`).then(async r=>{const d=await r.json(); if(!r.ok) setError(d.erro); else setData(d)})) },[params])
  if(error) return <main className="client-portal"><div className="client-panel"><p>{error}</p><a className="text-link" href="/area-do-cliente"><ArrowLeft size={14}/> Voltar</a></div></main>
  if(!data) return <main className="client-portal"><div className="client-panel"><p>Carregando resultados…</p></div></main>
  return <main className="client-portal"><header className="client-portal-header"><div><span className="eyebrow">Resultados da pesquisa</span><h1>{data.session.grupo || data.session.empresa}</h1><p>{data.session.tipo} · {new Date(data.session.criado_em).toLocaleDateString('pt-BR')}</p></div><a className="client-logout" href="/area-do-cliente"><ArrowLeft size={16}/> Voltar</a></header><section className="client-content client-results"><div className="client-panel"><BarChart3 size={24}/><h2>Resultados disponíveis</h2><p>{data.responses.length} respostas foram registradas nesta pesquisa. Para uma leitura completa dos indicadores e recomendações, fale com a equipe Kairós.</p><a className="button button-gold" href="/area-do-cliente">Voltar à visão geral</a></div><div className="client-panel"><h2>Comentários recebidos</h2>{data.responses.filter((r:any)=>r.comentario).map((r:any,i:number)=><blockquote key={i}>{r.comentario}</blockquote>)}{!data.responses.some((r:any)=>r.comentario)&&<p className="client-empty">Nenhum comentário textual foi registrado.</p>}</div></section></main>
}
