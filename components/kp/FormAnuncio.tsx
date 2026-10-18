'use client'

import { useMemo, useRef, useState } from 'react'

type Field = { name: string; label: string; optional?: boolean }

const fields: Field[] = [
  { name: 'empresa', label: 'Empresa' },
  { name: 'cnpj', label: 'CNPJ', optional: true },
  { name: 'responsavel', label: 'Responsável' },
  { name: 'email', label: 'E-mail' },
  { name: 'telefone', label: 'Telefone' },
  { name: 'cargo', label: 'Cargo' },
  { name: 'cidade', label: 'Cidade' },
  { name: 'contratacao', label: 'Tipo de contratação' },
  { name: 'faixa', label: 'Faixa salarial', optional: true },
]

const successMessage = 'Recebemos o seu anúncio. Ele será analisado e você receberá retorno por e-mail'

export default function FormAnuncio() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [missing, setMissing] = useState<string[]>([])

  const requiredLabels = useMemo(() => [
    ...fields.filter((field) => !field.optional),
    { name: 'descricao', label: 'Descrição' },
    { name: 'requisitos', label: 'Requisitos' },
    { name: 'termos', label: 'aceite dos termos' },
  ], [])

  function getMissing(form: HTMLFormElement) {
    return requiredLabels
      .filter(({ name }) => {
        const control = form.elements.namedItem(name)
        if (name === 'termos') return !(control instanceof HTMLInputElement && control.checked)
        return control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement
          ? !control.value.trim()
          : true
      })
      .map(({ label }) => label)
  }

  function updateMissing() {
    if (formRef.current) setMissing(getMissing(formRef.current))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const nextMissing = getMissing(form)
    setMissing(nextMissing)
    if (nextMissing.length || !form.reportValidity()) return

    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/kp/anuncios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      })
      if (!response.ok) throw new Error('Não foi possível enviar a vaga. Tente novamente.')
      setStatus('success')
      setMissing([])
    } catch (submissionError) {
      setStatus('error')
      setError(submissionError instanceof Error ? submissionError.message : 'Não foi possível enviar a vaga. Tente novamente.')
    }
  }

  function resetForm() {
    formRef.current?.reset()
    setStatus('idle')
    setError('')
    setMissing([])
  }

  if (status === 'success') {
    return <main className="kp-public"><header><strong>KAIRÓS</strong><span>Anuncie sua vaga</span></header><section className="kp-wrap kp-card" aria-live="polite"><h1>Anuncie sua vaga</h1><p>{successMessage}</p><button className="kp-button" type="button" onClick={resetForm}>Cadastrar outra vaga</button></section></main>
  }

  const isSending = status === 'sending'
  return <main className="kp-public"><header><strong>KAIRÓS</strong><span>Anuncie sua vaga</span></header><form ref={formRef} className="kp-form kp-wrap" onSubmit={submit} onInput={updateMissing}><h1>Anuncie sua vaga</h1>{fields.map(({ name, label, optional }) => <label key={name}>{label}{optional ? ' (opcional)' : ''}<input name={name} required={!optional} type={name === 'email' ? 'email' : 'text'} /></label>)}<label>Descrição<textarea name="descricao" required rows={4} /></label><label>Requisitos<textarea name="requisitos" required rows={4} /></label><input name="website" className="kp-honeypot" tabIndex={-1} /><label className="kp-check"><input name="termos" type="checkbox" required /> Confirmo que não discriminarei candidatos nem cobrarei qualquer valor deles.</label>{missing.length > 0 && <p className="kp-missing" aria-live="polite">Falta: {missing.join(', ')}</p>}{status === 'error' && <p className="kp-error" role="alert">{error}</p>}<button className="kp-button" type="submit" disabled={isSending}>{isSending ? 'Enviando...' : 'Enviar vaga'}</button></form></main>
}
