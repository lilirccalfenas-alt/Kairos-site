"use client";
import { useEffect, useState } from "react";
import { META } from "@/lib/kp/comp-meta";

export default function Vagas() {
  const [ok, setOk] = useState<boolean | null>(null);
  const [lista, setLista] = useState<any[]>([]);
  const [t, setT] = useState(""), [e, setE] = useState("");
  const [p, setP] = useState<Record<string, number>>(Object.fromEntries(META.map((m) => [m.id, 2])));
  async function carregar() { const r = await fetch("/api/kp/vagas"); if (r.status === 401) return setOk(false); setLista(await r.json()); setOk(true); }
  useEffect(() => { carregar(); }, []);
  async function criar() { if (!t.trim()) return alert("Informe o cargo"); await fetch("/api/kp/vagas", { method: "POST", body: JSON.stringify({ titulo: t, empresa: e, pesos: p }) }); setT(""); carregar(); }
  async function alternar(v: any) { await fetch("/api/kp/vagas", { method: "PATCH", body: JSON.stringify({ id: v.id, aberta: !v.aberta }) }); carregar(); }
  const box: any = { background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 16, margin: "12px 0" };
  const inp: any = { padding: 9, border: "1px solid #d9dde2", borderRadius: 8, margin: "4px 6px 4px 0" };
  if (ok === null) return null;
  if (!ok) return <main style={{ padding: 20 }}>Faça login em <a href="/kp/painel">/kp/painel</a> e volte aqui.</main>;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <h1>Recrutamento e entrevistas</h1>
      <div style={box}><h3>Nova vaga</h3>
        <input style={inp} placeholder="Cargo (ex.: Atendente)" value={t} onChange={(x) => setT(x.target.value)} />
        <input style={inp} placeholder="Empresa (opcional)" value={e} onChange={(x) => setE(x.target.value)} />
        <p style={{ margin: "8px 0 2px" }}><b>Peso de cada competência no perfil da vaga</b> (0 = ignorar, 3 = essencial)</p>
        {META.map((m) => (<label key={m.id} style={{ display: "inline-block", marginRight: 14 }}>{m.nome}: <select style={inp} value={p[m.id]} onChange={(x) => setP({ ...p, [m.id]: +x.target.value })}>{[0, 1, 2, 3].map((n) => <option key={n}>{n}</option>)}</select></label>))}
        <div><button onClick={criar}>Criar vaga</button></div></div>
      {lista.map((v) => (
        <div key={v.id} style={box}><b>{v.titulo}</b>{v.empresa ? ` | ${v.empresa}` : ""} <small>({v.aberta ? "aberta" : "encerrada"}, {v.kp_candidatos?.[0]?.count ?? 0} candidatos)</small>
          <p style={{ margin: "6px 0", fontSize: 13, wordBreak: "break-all" }}>Link para os candidatos: {typeof window !== "undefined" ? location.origin : ""}/kp/vaga/{v.id}</p>
          <a href={`/kp/painel/vagas/${v.id}`}>Ver candidatos e ranking</a> {" | "} <button onClick={() => alternar(v)}>{v.aberta ? "Encerrar" : "Reabrir"}</button></div>))}
    </main>
  );
}
