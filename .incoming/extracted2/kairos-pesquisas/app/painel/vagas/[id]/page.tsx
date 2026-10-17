"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { META } from "@/lib/comp-meta";

const nv = (x: number) => (x >= 75 ? 0 : x >= 50 ? 1 : 2);
const COR = ["#2f6b4f", "#b7860b", "#9b2c2c"], RGB = [[47, 107, 79], [183, 134, 11], [155, 44, 44]], ROT = ["Forte", "Em desenvolvimento", "Atenção"];

export default function Vaga() {
  const { id } = useParams<{ id: string }>();
  const [d, setD] = useState<any>(null);
  const [sel, setSel] = useState<any>(null);
  const [ent, setEnt] = useState<Record<string, number>>({}), [obs, setObs] = useState(""), [st, setSt] = useState("novo");
  async function carregar() { const r = await fetch(`/api/candidatos?vaga=${id}`); if (r.ok) setD(await r.json()); }
  useEffect(() => { carregar(); }, [id]);
  if (!d) return <p style={{ padding: 20 }}>Carregando...</p>;
  const lista = [...d.candidatos].sort((a: any, b: any) => b.ader - a.ader);
  function abrir(c: any) { setSel(c); setEnt(c.entrevista ?? {}); setObs(c.obs ?? ""); setSt(c.status); }
  async function salvar() {
    const e = Object.keys(ent).length ? ent : null;
    await fetch("/api/candidatos", { method: "PATCH", body: JSON.stringify({ id: sel.id, entrevista: e, obs, status: st }) });
    setSel(null); carregar();
  }
  async function excluir(c: any) { if (confirm(`Excluir definitivamente os dados de ${c.nome}?`)) { await fetch("/api/candidatos", { method: "DELETE", body: JSON.stringify({ id: c.id }) }); setSel(null); carregar(); } }
  function pdf(c: any) {
    const p = new jsPDF({ unit: "mm", format: "a4" });
    p.setFillColor(22, 40, 60); p.rect(0, 0, 210, 30, "F"); p.setFillColor(201, 162, 74); p.rect(0, 30, 210, 1.5, "F");
    p.setTextColor(255); p.setFont("helvetica", "bold"); p.setFontSize(18); p.text("KAIRÓS", 15, 15);
    p.setFont("helvetica", "normal"); p.setFontSize(10); p.text("Gestão e Liderança | Relatório de Competências do Candidato", 15, 22);
    p.setTextColor(22, 40, 60); p.setFont("helvetica", "bold"); p.setFontSize(14); p.text(c.nome, 15, 42);
    p.setFont("helvetica", "normal"); p.setFontSize(10);
    p.text(`Vaga: ${d.vaga.titulo}${d.vaga.empresa ? " | " + d.vaga.empresa : ""}`, 15, 48);
    p.text(`Contato: ${[c.email, c.telefone, c.cidade].filter(Boolean).join(" | ")}`, 15, 54);
    p.text(`Aderência ao perfil da vaga: ${c.ader}%   |   Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, 15, 60);
    let y = 72;
    META.forEach((m) => {
      const v = c.comp[m.id], k = nv(v), rg = RGB[k];
      p.setTextColor(22, 40, 60); p.setFont("helvetica", "normal"); p.text(`${m.nome} (peso ${d.vaga.pesos[m.id] ?? 1})`, 15, y);
      p.setFillColor(217, 221, 226); p.rect(75, y - 3.5, 70, 4, "F"); p.setFillColor(rg[0], rg[1], rg[2]); p.rect(75, y - 3.5, (70 * v) / 100, 4, "F");
      p.setTextColor(rg[0], rg[1], rg[2]); p.setFont("helvetica", "bold"); p.text(`${v}% ${ROT[k]}`, 150, y); y += 8;
    });
    const ord = META.map((m) => m.id).sort((a, b) => c.comp[b] - c.comp[a]), nome = (i: string) => META.find((m) => m.id === i)!.nome;
    y += 4; p.setTextColor(22, 40, 60); p.setFont("helvetica", "bold"); p.text("Pontos fortes: " + ord.slice(0, 2).map(nome).join(", "), 15, y); y += 6;
    p.text("Pontos de atenção: " + ord.slice(-2).map(nome).join(", "), 15, y); y += 8;
    p.setFont("helvetica", "normal"); p.setFontSize(9.5);
    const o = p.splitTextToSize("Observações da consultora: " + (c.obs || "—"), 180); p.text(o, 15, y); y += o.length * 4.6 + 6;
    const nt = p.splitTextToSize("Este documento é um RELATÓRIO DE COMPETÊNCIAS, elaborado a partir de teste situacional e entrevista estruturada. Não é laudo psicológico nem avaliação psicológica e não deve ser usado como único critério de decisão. A decisão final é humana, sem discriminação, e os dados são tratados conforme a LGPD.", 180);
    p.setTextColor(91, 102, 112); p.setFontSize(8.5); p.text(nt, 15, y);
    p.save(`Relatorio_${c.nome.replace(/\s+/g, "_")}.pdf`);
  }
  const box: any = { background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 16, margin: "12px 0" };
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <a href="/painel/vagas">← Vagas</a>
      <h1>{d.vaga.titulo}</h1><p>{lista.length} candidatos, ordenados por aderência ao perfil da vaga.</p>
      <div style={box}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ textAlign: "left" }}><th>#</th><th>Candidato</th><th>Aderência</th><th>Entrevista</th><th>Status</th><th></th></tr></thead><tbody>
        {lista.map((c: any, i: number) => (<tr key={c.id} style={{ borderTop: "1px solid #d9dde2" }}><td>{i + 1}</td><td>{c.nome}<br /><small>{c.cidade}</small></td><td><b style={{ color: COR[nv(c.ader)] }}>{c.ader}%</b></td><td>{c.entrevista ? "feita" : "pendente"}</td><td>{c.status}</td><td><button onClick={() => abrir(c)}>Abrir</button></td></tr>))}
      </tbody></table></div>
      {sel && (<div style={box}>
        <h3>{sel.nome} <small>({sel.email} | {sel.telefone})</small></h3>
        {META.map((m) => (<div key={m.id} style={{ margin: "10px 0" }}>
          <b>{m.nome}</b> — teste: <b style={{ color: COR[nv(sel.notas[m.id])] }}>{sel.notas[m.id]}%</b>
          <ul style={{ margin: "4px 0", fontSize: 13, color: "#5b6670" }}>{m.ent.map((q) => <li key={q}>{q}</li>)}</ul>
          Nota da entrevista (1 a 5): <select value={ent[m.id] ?? ""} onChange={(x) => { const n = { ...ent }; x.target.value ? (n[m.id] = +x.target.value) : delete n[m.id]; setEnt(n); }}><option value="">—</option>{[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}</select></div>))}
        <textarea placeholder="Observações da entrevista" value={obs} onChange={(x) => setObs(x.target.value)} rows={3} style={{ width: "100%", padding: 10, border: "1px solid #d9dde2", borderRadius: 8 }} />
        <p>Status: <select value={st} onChange={(x) => setSt(x.target.value)}>{["novo", "chamar", "aguardar", "descartado"].map((s) => <option key={s}>{s}</option>)}</select></p>
        <button onClick={salvar}>Salvar</button> <button onClick={() => pdf(lista.find((c: any) => c.id === sel.id) ?? sel)}>Baixar relatório em PDF</button> <button onClick={() => excluir(sel)} style={{ background: "#9b2c2c" }}>Excluir dados</button>
        <p style={{ fontSize: 12, color: "#5b6670" }}>Dica: salve a entrevista antes de baixar o PDF, para a aderência incluir as notas.</p></div>)}
    </main>
  );
}
