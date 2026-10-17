'use client'

import { useState } from 'react'
import { dimensoes, escala, totalItens } from '@/lib/pesquisa-data'

export function PesquisaForm({ id, empresa, grupo }: { id: string; empresa: string; grupo?: string | null }) {
  const [step, setStep] = useState(-1)
  const [consent, setConsent] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const current = dimensoes[step]
  const complete = current ? current[1].every((_, index) => answers[`${step}-${index}`]) : false
  const submit = async () => {
    setStatus('sending')
    const response = await fetch('/api/pesquisa/respostas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessaoId: id, respostas: answers, comentario: comment }) })
    if (response.ok) setStatus('done')
    else { const data = await response.json().catch(() => ({})); setError(data.error || 'Não foi possível enviar.'); setStatus('error') }
  }
  return <main className="survey-shell"><header className="survey-header"><strong>Kairós</strong><span>Pesquisa de clima e riscos psicossociais</span></header><div className="survey-card">
    {status === 'done' ? <div className="survey-success"><span className="survey-check">✓</span><h1>Obrigado(a)!</h1><p>Sua resposta foi registrada de forma anônima.</p></div> : step < 0 ? <><span className="survey-eyebrow">{empresa}{grupo ? ` · ${grupo}` : ''}</span><h1>Uma escuta importante para transformar o trabalho.</h1><p>Esta pesquisa tem {totalItens} afirmações e leva cerca de 8 minutos. Não há respostas certas ou erradas.</p><div className="survey-notice"><strong>Sua participação é anônima.</strong><span>Não pedimos seu nome nem guardamos dados do aparelho.</span></div><label className="survey-consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /> Li e concordo em participar.</label><button className="button button-navy" disabled={!consent} onClick={() => setStep(0)}>Começar pesquisa</button></> : step >= dimensoes.length ? <><span className="survey-eyebrow">Última etapa</span><h1>Há algo mais que você gostaria de compartilhar?</h1><p>Opcional. Não escreva seu nome ou dados que identifiquem você.</p><textarea className="survey-textarea" maxLength={500} value={comment} onChange={(event) => setComment(event.target.value)} rows={5} />{error && <p className="survey-error">{error}</p>}<div className="survey-actions"><button className="button button-light" onClick={() => setStep(step - 1)}>Voltar</button><button className="button button-navy" disabled={status === 'sending'} onClick={submit}>{status === 'sending' ? 'Enviando...' : 'Enviar resposta'}</button></div></> : <><div className="survey-progress"><span>Bloco {step + 1} de {dimensoes.length}</span><div><i style={{ width: `${((step + 1) / dimensoes.length) * 100}%` }} /></div></div><span className="survey-eyebrow">{current[0]}</span><h1>Como você percebe esta situação?</h1>{current[1].map((question, index) => <fieldset className="survey-question" key={question}><legend>{question}</legend><div className="survey-scale">{escala.map((label, value) => <button type="button" key={label} className={answers[`${step}-${index}`] === value + 1 ? 'selected' : ''} onClick={() => setAnswers({ ...answers, [`${step}-${index}`]: value + 1 })}><strong>{value + 1}</strong><span>{label}</span></button>)}</div></fieldset>)}<div className="survey-actions"><button className="button button-light" disabled={step === 0} onClick={() => setStep(step - 1)}>Voltar</button><button className="button button-navy" disabled={!complete} onClick={() => setStep(step + 1)}>{step === dimensoes.length - 1 ? 'Continuar' : 'Próximo'}</button></div></>}
  </div></main>
}
