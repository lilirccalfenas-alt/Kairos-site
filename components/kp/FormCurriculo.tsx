'use client'
import { useRef, useState } from 'react'

const MAX_BYTES = 3 * 1024 * 1024

export default function FormCurriculo() {
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const sending = useRef(false)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sending.current) return
    const form = e.currentTarget
    const fd = new FormData(form)

    const file = fd.get('arquivo')
    if (file instanceof File && file.size > MAX_BYTES) {
      setMsg('O arquivo excede 3 MB.')
      return
    }

    sending.current = true
    setBusy(true)
    setMsg('')
    try {
      const r = await fetch('/api/kp/curriculos', { method: 'POST', body: fd })
      if (r.ok) {
        setMsg('Currículo recebido. Obrigado!')
        form.reset()
      } else {
        const data = await r.json().catch(() => null)
        setMsg(data?.error || 'Não foi possível enviar agora.')
      }
    } catch {
      setMsg('Falha de conexão. Tente novamente.')
    } finally {
      sending.current = false
      setBusy(false)
    }
  }

  return (
    <main className="kp-public">
      <header>
        <strong>KAIRÓS</strong>
        <span>Banco de talentos</span>
      </header>
      <form className="kp-form kp-wrap" onSubmit={submit}>
        <h1>Cadastre seu currículo</h1>
        <p className="kp-muted">Seu currículo será tratado conforme a LGPD.</p>
        {['nome|Nome completo', 'email|E-mail', 'telefone|Telefone', 'cidade|Cidade', 'area|Área de interesse', 'escolaridade|Escolaridade'].map((x) => {
          const [name, label] = x.split('|')
          return (
            <label key={name}>
              {label}
              <input name={name} required type={name === 'email' ? 'email' : 'text'} />
            </label>
          )
        })}
        <label>
          Resumo da experiência
          <textarea name="resumo" required rows={5} />
        </label>
        <label>
          Currículo (PDF, DOC ou DOCX, até 3 MB)
          <input name="arquivo" type="file" accept=".pdf,.doc,.docx" />
        </label>
        <input name="website" className="kp-honeypot" tabIndex={-1} autoComplete="off" />
        <label className="kp-check">
          <input name="lgpd" type="checkbox" required /> Aceito o uso dos meus dados conforme a LGPD.
        </label>
        <label className="kp-check">
          <input name="parceiros" type="checkbox" /> Autorizo compartilhar meu currículo com empresas parceiras.
        </label>
        {msg && <p>{msg}</p>}
        <button className="kp-button" disabled={busy}>
          {busy ? 'Enviando...' : 'Enviar currículo'}
        </button>
      </form>
    </main>
  )
}