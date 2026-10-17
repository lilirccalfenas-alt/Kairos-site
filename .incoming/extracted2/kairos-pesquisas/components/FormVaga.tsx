"use client";
import { useState } from "react";

const C = { navy: "#16283c", gold: "#c9a24a", line: "#d9dde2", mut: "#5b6670" };
const embaralhar = (a: any[]) => [...a].sort(() => Math.random() - 0.5);
export default function FormVaga({ id, titulo, empresa, blocos }: any) {
  const [ordem] = useState(() => blocos.map((b: any) => b.q.map((q: any) => embaralhar(q.o))));
  const [step, setStep] = useState(-1);
  const [f, setF] = useState({ nome: "", email: "", telefone: "", cidade: "" });
  const [lgpd, setLgpd] = useState(false), [banco, setBanco] = useState(false);
  const [r, setR] = useState<Record<string, number>>({});
  const [msg, setMsg] = useState(""), [busy, setBusy] = useState(false), [fim, setFim] = useState(false);
  const card: any = { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: 18, margin: "14px 0" };
  const inp: any = { width: "100%", padding: 10, border: `1px solid ${C.line}`, borderRadius: 8, margin: "4px 0 10px", font: "inherit" };
  const btn = (p?: boolean): any => ({ padding: "11px 18px", borderRadius: 8, border: `1px solid ${p ? C.navy : C.line}`, background: p ? C.navy : "#fff", color: p ? "#fff" : C.navy, fontWeight: 600, fontSize: 15 });
  const b = blocos[step];
  const dadosOk = f.nome.trim() && f.email.includes("@") && lgpd;
  const blocoOk = b && b.q.every((_: any, j: number) => r[`${b.id}-${j}`] !== undefined);

  async function enviar() {
    setBusy(true);
    const x = await fetch("/api/candidatar", { method: "POST", body: JSON.stringify({ vaga: id, ...f, lgpd, banco, r }) });
    setBusy(false);
    if (x.ok) return setFim(true);
    const { erro } = await x.json().catch(() => ({ erro: "" }));
    setMsg(erro === "ja_candidatou" ? "Já existe uma inscrição com este e-mail." : erro === "encerrada" ? "A vaga foi encerrada." : "Não foi possível enviar. Tente novamente.");
  }
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f5f3ee", minHeight: "100vh", color: C.navy }}>
      <header style={{ background: C.navy, color: "#fff", padding: "14px 18px", borderBottom: `3px solid ${C.gold}` }}>
        <b style={{ fontSize: 20, letterSpacing: 1 }}>KAIRÓS</b><div style={{ fontSize: 12, color: "#e6ddc3" }}>Gestão e Liderança</div>
      </header>
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "8px 16px 40px" }}>
        {fim ? <div style={card}><h2>Inscrição recebida!</h2><p>Obrigado(a), {f.nome.split(" ")[0]}. Entraremos em contato se o seu perfil seguir no processo.</p></div>
        : step < 0 ? (
          <div style={card}>
            <h2>{titulo}</h2>{empresa && <p style={{ color: C.mut }}>{empresa}</p>}
            <p style={{ color: C.mut }}>Preencha seus dados e responda 12 situações do dia a dia de trabalho (cerca de 10 minutos). Não há resposta “perfeita”: escolha a que mais se parece com o que você faria.</p>
            <label>Nome completo<input style={inp} value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></label>
            <label>E-mail<input style={inp} type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
            <label>Telefone / WhatsApp<input style={inp} value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} /></label>
            <label>Cidade<input style={inp} value={f.cidade} onChange={(e) => setF({ ...f, cidade: e.target.value })} /></label>
            <p style={{ background: "#f6efdd", borderLeft: `3px solid ${C.gold}`, padding: 10, borderRadius: 6, fontSize: 13 }}>Seus dados serão usados apenas neste processo seletivo, conforme a LGPD. Você pode pedir a exclusão a qualquer momento. O resultado apoia a análise da consultora e não é uma decisão automática.</p>
            <label style={{ display: "block", margin: "8px 0" }}><input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} /> Li e concordo com o uso dos meus dados neste processo seletivo.</label>
            <label style={{ display: "block", margin: "8px 0" }}><input type="checkbox" checked={banco} onChange={(e) => setBanco(e.target.checked)} /> (Opcional) Autorizo guardar meus dados por até 12 meses para ser considerado(a) em futuras vagas.</label>
            <div style={{ textAlign: "right" }}><button style={btn(true)} disabled={!dadosOk} onClick={() => setStep(0)}>Começar</button></div>
          </div>
        ) : step >= blocos.length ? (
          <div style={card}><h3>Pronto para enviar</h3><p>Confira se está tudo certo. Depois de enviar, não é possível alterar.</p>
            {msg && <p style={{ color: "#9b2c2c" }}>{msg}</p>}
            <div style={{ display: "flex", justifyContent: "space-between" }}><button style={btn()} onClick={() => setStep(step - 1)}>Voltar</button><button style={btn(true)} disabled={busy} onClick={enviar}>{busy ? "Enviando..." : "Enviar inscrição"}</button></div></div>
        ) : (
          <div style={card}>
            <small style={{ color: C.mut }}>Bloco {step + 1} de {blocos.length}</small>
            <div style={{ height: 6, background: C.line, borderRadius: 4, margin: "6px 0 14px" }}><div style={{ height: "100%", width: `${(step / blocos.length) * 100}%`, background: C.gold, borderRadius: 4 }} /></div>
            {b.q.map((q: any, j: number) => (
              <div key={j} style={{ padding: "12px 0", borderTop: `1px solid ${C.line}` }}>
                <p style={{ margin: "0 0 8px", fontWeight: 600 }}>{q.t}</p>
                {ordem[step][j].map((o: any) => (
                  <button key={o.i} onClick={() => setR({ ...r, [`${b.id}-${j}`]: o.i })} style={{ display: "block", width: "100%", textAlign: "left", margin: "6px 0", padding: 10, borderRadius: 8, fontSize: 14, border: `1px solid ${r[`${b.id}-${j}`] === o.i ? C.navy : C.line}`, background: r[`${b.id}-${j}`] === o.i ? C.navy : "#fff", color: r[`${b.id}-${j}`] === o.i ? "#fff" : C.navy }}>{o.t}</button>
                ))}
              </div>))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}><button style={btn()} onClick={() => setStep(step - 1)}>Voltar</button><button style={btn(true)} disabled={!blocoOk} onClick={() => setStep(step + 1)}>Próximo</button></div>
          </div>)}
      </main>
    </div>
  );
}
