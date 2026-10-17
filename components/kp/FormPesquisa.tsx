"use client";
import { useState } from "react";
import { DIM, ESCALA } from "@/lib/kp/dimensoes";

const C = { navy: "#16283c", gold: "#c9a24a", line: "#d9dde2", mut: "#5b6670" };
export default function Form({ id, t, empresa, grupo }: { id: string; t: string; empresa: string; grupo?: string | null }) {
  const [step, setStep] = useState(-1);
  const [ok, setOk] = useState(false);
  const [a, setA] = useState<Record<string, number>>({});
  const [c, setC] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [fim, setFim] = useState(false);
  const d = DIM[step];
  const completo = d && d[1].every((_, j) => a[`${step}-${j}`]);

  async function enviar() {
    setBusy(true);
    const r = await fetch("/api/kp/responder", { method: "POST", body: JSON.stringify({ id, t, a, c }) });
    setBusy(false);
    if (r.ok) return setFim(true);
    const { erro } = await r.json().catch(() => ({ erro: "" }));
    setMsg(erro === "qr_expirado" ? "O QR code expirou. Escaneie novamente." : erro === "ja_respondeu" ? "Você já respondeu. Obrigado!" : erro === "limite" || erro === "encerrada" ? "A pesquisa foi encerrada." : "Não foi possível enviar. Tente novamente.");
  }
  const card: React.CSSProperties = { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, margin: "14px 0" };
  const btn = (p?: boolean): React.CSSProperties => ({ padding: "11px 18px", borderRadius: 8, border: `1px solid ${p ? C.navy : C.line}`, background: p ? C.navy : "#fff", color: p ? "#fff" : C.navy, fontWeight: 600, fontSize: 15 });

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f5f3ee", minHeight: "100vh", color: C.navy }}>
      <header style={{ background: C.navy, color: "#fff", padding: "14px 18px", borderBottom: `3px solid ${C.gold}` }}>
        <b style={{ fontSize: 20, letterSpacing: 1 }}>KAIRÓS</b><div style={{ fontSize: 12, color: "#e6ddc3" }}>Gestão e Liderança</div>
      </header>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "8px 16px 40px" }}>
        {fim ? (
          <div style={card}><h2>Obrigado(a)!</h2><p>Sua resposta foi registrada de forma anônima.</p></div>
        ) : step < 0 ? (
          <div style={card}>
            <h2>Pesquisa de clima e riscos psicossociais</h2>
            <p style={{ color: C.mut }}>{empresa}{grupo ? ` | ${grupo}` : ""}</p>
            <p style={{ color: C.mut }}>20 afirmações, cerca de 8 minutos. Não há respostas certas ou erradas.</p>
            <p style={{ background: "#f6efdd", borderLeft: `3px solid ${C.gold}`, padding: 10, borderRadius: 6, fontSize: 13 }}>
              A pesquisa é <b>anônima</b>: não pedimos seu nome nem guardamos dados do seu aparelho. Os resultados só são divulgados em grupos com 5 ou mais respondentes e são tratados conforme a LGPD.
            </p>
            <label><input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} /> Li e concordo em participar.</label>
            <div style={{ marginTop: 14, textAlign: "right" }}><button style={btn(true)} disabled={!ok} onClick={() => setStep(0)}>Começar</button></div>
          </div>
        ) : step >= DIM.length ? (
          <div style={card}>
            <h3>Para finalizar</h3>
            <p>O que mais precisa melhorar no seu trabalho? (opcional)</p>
            <textarea value={c} maxLength={500} onChange={(e) => setC(e.target.value)} placeholder="Não escreva seu nome nem dados que identifiquem você." rows={4} style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${C.line}`, font: "inherit" }} />
            {msg && <p style={{ color: "#9b2c2c" }}>{msg}</p>}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
              <button style={btn()} onClick={() => setStep(step - 1)}>Voltar</button>
              <button style={btn(true)} disabled={busy} onClick={enviar}>{busy ? "Enviando..." : "Enviar resposta"}</button>
            </div>
          </div>
        ) : (
          <div style={card}>
            <small style={{ color: C.mut }}>Bloco {step + 1} de {DIM.length}</small>
            <div style={{ height: 6, background: C.line, borderRadius: 4, margin: "6px 0 14px" }}><div style={{ height: "100%", width: `${(step / DIM.length) * 100}%`, background: C.gold, borderRadius: 4 }} /></div>
            <h2>{d[0]}</h2>
            {d[1].map((q, j) => (
              <div key={j} style={{ padding: "12px 0", borderTop: `1px solid ${C.line}` }}>
                <p style={{ margin: "0 0 8px", fontWeight: 500 }}>{q[0]}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6 }}>
                  {ESCALA.map((l, v) => (
                    <button key={v} onClick={() => setA({ ...a, [`${step}-${j}`]: v + 1 })} style={{ padding: "9px 2px", fontSize: 11, borderRadius: 8, border: `1px solid ${a[`${step}-${j}`] === v + 1 ? C.navy : C.line}`, background: a[`${step}-${j}`] === v + 1 ? C.navy : "#fff", color: a[`${step}-${j}`] === v + 1 ? "#fff" : C.navy }}>{l}</button>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
              <button style={btn()} onClick={() => setStep(step - 1)}>Voltar</button>
              <button style={btn(true)} disabled={!completo} onClick={() => setStep(step + 1)}>Próximo</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
