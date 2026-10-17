"use client";
import { useEffect, useState } from "react";
import { META } from "@/lib/kp/comp-meta";

export default function Talentos() {
  const [l, setL] = useState<any[] | null>(null);
  const [comp, setComp] = useState(""), [min, setMin] = useState(60);
  useEffect(() => { fetch("/api/kp/candidatos").then((r) => (r.ok ? r.json() : [])).then(setL); }, []);
  if (!l) return null;
  const f = l.filter((c) => !comp || c.comp[comp] >= min).sort((a, b) => (comp ? b.comp[comp] - a.comp[comp] : b.ader - a.ader));
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <h1>Banco de talentos</h1><p>Candidatos que autorizaram guardar os dados para futuras vagas (até 12 meses).</p>
      <p>Filtrar por competência: <select value={comp} onChange={(e) => setComp(e.target.value)}><option value="">todas</option>{META.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}</select> mínimo de <input type="number" value={min} onChange={(e) => setMin(+e.target.value)} style={{ width: 60 }} />%</p>
      {f.map((c) => (<div key={c.id} style={{ background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 14, margin: "10px 0" }}>
        <b>{c.nome}</b> <small>({c.cidade || "—"}) | {c.email} | {c.telefone}</small><br />
        <small>Vaga de origem: {c.kp_vagas?.titulo} | Aderência geral: {c.ader}%</small><br />
        <small>{META.map((m) => `${m.nome}: ${c.comp[m.id]}%`).join(" | ")}</small></div>))}
      {!f.length && <p>Nenhum candidato com esses critérios.</p>}
    </main>
  );
}
