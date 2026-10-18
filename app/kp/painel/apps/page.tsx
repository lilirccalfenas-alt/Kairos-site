"use client";
import { useEffect, useState } from "react";
import { APPS } from "@/lib/kp/apps";

const box: React.CSSProperties = { background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 16, margin: "12px 0" };
const quando = (x: string) => new Date(x).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

export default function Central() {
  const [d, setD] = useState<any>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  async function carregar() {
    const r = await fetch("/api/kp/geral");
    if (r.status === 401) return setOk(false);
    if (r.ok) { setD(await r.json()); setOk(true); }
  }
  useEffect(() => { carregar(); }, []);
  async function entrar() {
    const r = await fetch("/api/kp/login", { method: "POST", body: JSON.stringify({ pw }) });
    r.ok ? carregar() : alert("Senha incorreta");
  }
  if (ok === null) return null;
  const K = d?.kpis;
  const cards: [string, number][] = K ? [["Pesquisas abertas", K.pesquisasAbertas], ["Respostas de clima", K.respostas], ["Vagas abertas", K.vagasAbertas], ["Candidatos", K.candidatos], ["Candidatos novos", K.candidatosNovos], ["Banco de talentos", K.talentos]] : [];
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <h1>Visão geral</h1>
      {!ok ? (
        <div style={box}><p>Entre com a sua senha para ver o resumo de todos os apps.</p>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Senha" style={{ padding: 9, border: "1px solid #d9dde2", borderRadius: 8, marginRight: 8 }} /><button onClick={entrar}>Entrar</button></div>
      ) : (<>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
          {cards.map(([t, n]) => (<div key={t} style={{ ...box, margin: 0, borderTop: "3px solid #c9a24a", textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 700 }}>{n}</div><small style={{ color: "#5b6670" }}>{t}</small></div>))}
        </div>

        <div style={box}><h3>Pesquisas de clima e riscos psicossociais</h3>
          {d.sessoes.length === 0 ? <p style={{ color: "#5b6670" }}>Nenhuma aplicação ainda.</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ textAlign: "left" }}><th>Empresa</th><th>Grupo</th><th>Status</th><th>Respostas</th><th></th></tr></thead><tbody>
              {d.sessoes.map((s: any) => (<tr key={s.id} style={{ borderTop: "1px solid #d9dde2" }}><td>{s.empresa}</td><td>{s.grupo || "—"}</td><td>{s.aberta ? "aberta" : "encerrada"}</td><td>{s.n}{s.n < 5 ? " (mín. 5)" : ""}</td><td><a href={`/kp/painel/resultados/${s.id}`}>Resultados</a> | <a href={`/kp/painel/qr/${s.id}`} target="_blank">QR</a></td></tr>))}
            </tbody></table>)}
          <p><a href="/kp/painel">Gerenciar aplicações e criar novas →</a></p></div>

        <div style={box}><h3>Recrutamento</h3>
          {d.vagas.length === 0 ? <p style={{ color: "#5b6670" }}>Nenhuma vaga ainda.</p> : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ textAlign: "left" }}><th>Cargo</th><th>Empresa</th><th>Status</th><th>Candidatos</th><th></th></tr></thead><tbody>
              {d.vagas.map((v: any) => (<tr key={v.id} style={{ borderTop: "1px solid #d9dde2" }}><td>{v.titulo}</td><td>{v.empresa || "—"}</td><td>{v.aberta ? "aberta" : "encerrada"}</td><td>{v.n}</td><td><a href={`/kp/painel/vagas/${v.id}`}>Ranking</a></td></tr>))}
            </tbody></table>)}
          <p><a href="/kp/painel/vagas">Gerenciar vagas →</a> &nbsp; <a href="/kp/painel/talentos">Banco de talentos ({K.talentos}) →</a></p></div>

        <div style={box}><h3>Últimas atividades</h3>
          {d.atividades.length === 0 ? <p style={{ color: "#5b6670" }}>Sem atividade recente.</p> : d.atividades.map((a: any, i: number) => (
            <p key={i} style={{ margin: "6px 0" }}><small style={{ color: "#5b6670" }}>{quando(a.quando)}</small> &nbsp; <a href={a.href}>{a.texto}</a></p>))}</div>
      </>)}

      <h2 style={{ marginTop: 28 }}>Aplicativos</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
        {APPS.map((a) => (
          <div key={a.id} style={{ ...box, margin: 0, opacity: a.pronto ? 1 : 0.65, borderTop: `3px solid ${a.pronto ? "#c9a24a" : "#d9dde2"}` }}>
            <h3 style={{ margin: "0 0 6px" }}>{a.nome}</h3>
            <p style={{ fontSize: 13, color: "#5b6670", margin: "0 0 10px" }}>{a.desc}</p>
            {a.pronto ? <a href={a.href}>Abrir</a> : <small>Em breve</small>}
          </div>))}
      </div>
    </main>
  );
}
