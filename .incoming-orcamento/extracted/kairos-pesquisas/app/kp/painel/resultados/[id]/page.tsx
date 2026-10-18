"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsPDF } from "jspdf";
import { DIM } from "@/lib/kp/dimensoes";
import { sugerir, type Item } from "@/lib/kp/orcamento";

const NIVEL = ["Baixo", "Moderado", "Alto", "Crítico"];
const COR = ["#2f6b4f", "#b7860b", "#c25a1a", "#9b2c2c"];
const RGB = [[47, 107, 79], [183, 134, 11], [194, 90, 26], [155, 44, 44]];
const lvl = (m: number) => (m < 2 ? 0 : m < 3 ? 1 : m < 4 ? 2 : 3);

export default function Resultados() {
  const { id } = useParams<{ id: string }>();
  const [d, setD] = useState<any>(null);
  const [teste, setTeste] = useState(false);
  useEffect(() => { fetch(`/api/kp/resultados?id=${id}${teste ? "&teste=1" : ""}`).then((r) => r.json()).then(setD); }, [id, teste]);
  const [modo, setModo] = useState<"diag" | "orc">("diag");
  const [itens, setItens] = useState<Item[]>([]);
  const [desc, setDesc] = useState(0), [validade, setValidade] = useState(15), [cond, setCond] = useState("");
  useEffect(() => { if (d && d.medias) setItens(sugerir(d.medias)); }, [d]);
  const num = (s: string) => parseFloat(String(s).replace(/\./g, "").replace(",", ".")) || 0;
  const brl = (v: number) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  if (!d) return <p style={{ padding: 20 }}>Carregando...</p>;

  const ordem = d.medias ? d.medias.map((_: number, i: number) => i).sort((a: number, b: number) => d.medias[b] - d.medias[a]) : [];
  const plano = ordem.filter((i: number) => lvl(d.medias[i]) >= 1);

  function pdf() {
    const p = new jsPDF({ unit: "mm", format: "a4" });
    p.setFillColor(22, 40, 60); p.rect(0, 0, 210, 30, "F"); p.setFillColor(201, 162, 74); p.rect(0, 30, 210, 1.5, "F");
    p.setTextColor(255); p.setFont("helvetica", "bold"); p.setFontSize(18); p.text("KAIRÓS", 15, 15);
    p.setFont("helvetica", "normal"); p.setFontSize(10); p.text("Gestão e Liderança | Relatório de Clima e Riscos Psicossociais", 15, 22);
    p.setTextColor(22, 40, 60); p.setFont("helvetica", "bold"); p.setFontSize(13); p.text(d.empresa + (d.grupo ? " | " + d.grupo : ""), 15, 42);
    p.setFont("helvetica", "normal"); p.setFontSize(10);
    p.text(`Respondentes: ${d.n}${d.teste ? " (MODO TESTE)" : ""}   |   Aplicação: ${d.tipo}   |   Emitido em: ${new Date().toLocaleDateString("pt-BR")}`, 15, 48);
    p.text(`Índice geral de exposição: ${d.geral.toFixed(2)} (${NIVEL[lvl(d.geral)]}) - escala de 1 a 5; maior valor = maior risco`, 15, 56);
    let y = 68;
    DIM.forEach((x, i) => {
      const c = RGB[lvl(d.medias[i])];
      p.setTextColor(22, 40, 60); p.setFont("helvetica", "normal"); p.text(x[0], 15, y);
      p.setFillColor(217, 221, 226); p.rect(70, y - 3.5, 70, 4, "F"); p.setFillColor(c[0], c[1], c[2]); p.rect(70, y - 3.5, (70 * d.medias[i]) / 5, 4, "F");
      p.setTextColor(c[0], c[1], c[2]); p.setFont("helvetica", "bold"); p.text(`${d.medias[i].toFixed(2)} ${NIVEL[lvl(d.medias[i])]}`, 145, y); y += 8;
    });
    y += 4; p.setTextColor(22, 40, 60); p.setFontSize(12); p.text("Plano de ação sugerido", 15, y); y += 7; p.setFontSize(9.5); p.setFont("helvetica", "normal");
    plano.forEach((i: number) => {
      const t = p.splitTextToSize(`${DIM[i][0]} (${NIVEL[lvl(d.medias[i])]}): ${DIM[i][2]}  Responsável: ______  Prazo: ______  Reavaliação: 90 dias.`, 180);
      if (y + t.length * 4.6 > 272) { p.addPage(); y = 20; } p.text(t, 15, y); y += t.length * 4.6 + 2;
    });
    const nt = p.splitTextToSize("Este relatório é um insumo para o gerenciamento de riscos ocupacionais (NR-1, GRO/PGR). Não substitui a avaliação do profissional de SST nem comprova, sozinho, a conformidade da empresa. Resultados anônimos e agregados, tratados conforme a LGPD.", 180);
    if (y + nt.length * 4.6 > 280) { p.addPage(); y = 20; } p.setTextColor(91, 102, 112); p.setFontSize(8.5); p.text(nt, 15, y + 6);
    if (modo === "orc") {
      p.addPage(); p.setFillColor(22, 40, 60); p.rect(0, 0, 210, 22, "F"); p.setFillColor(201, 162, 74); p.rect(0, 22, 210, 1.2, "F");
      p.setTextColor(255); p.setFont("helvetica", "bold"); p.setFontSize(15); p.text("KAIRÓS | Proposta de trabalho", 15, 14);
      let z = 36; p.setTextColor(22, 40, 60); p.setFontSize(11); p.text(d.empresa + (d.grupo ? " | " + d.grupo : ""), 15, z); z += 7;
      p.setFont("helvetica", "normal"); p.setFontSize(9.5);
      const intro = p.splitTextToSize("Com base no diagnóstico de clima e riscos psicossociais, sugerimos as frentes abaixo, em ordem de prioridade. Escopo, prazos e valores serão confirmados em conversa com a empresa.", 180);
      p.text(intro, 15, z); z += intro.length * 4.6 + 5;
      let soma = 0;
      itens.filter((i) => i.inc).forEach((i) => {
        const v = num(i.valor); soma += v; const m = p.splitTextToSize(i.motivo, 125);
        if (z + 8 + m.length * 4.4 > 262) { p.addPage(); z = 20; }
        p.setFont("helvetica", "bold"); p.setTextColor(22, 40, 60); p.text(i.servico, 15, z); p.text(v ? brl(v) : "Sob consulta", 195, z, { align: "right" });
        p.setFont("helvetica", "normal"); p.setTextColor(91, 102, 112); p.text(m, 15, z + 4.8); z += 8 + m.length * 4.4;
        p.setDrawColor(217, 221, 226); p.line(15, z - 2.5, 195, z - 2.5);
      });
      const tot = soma * (1 - desc / 100);
      p.setTextColor(22, 40, 60); p.setFont("helvetica", "bold");
      if (soma) { if (desc) { p.text(`Subtotal: ${brl(soma)}   |   Desconto: ${desc}%`, 195, z + 3, { align: "right" }); z += 6; } p.setFontSize(11); p.text(`Total: ${brl(tot)}`, 195, z + 4, { align: "right" }); z += 10; }
      p.setFont("helvetica", "normal"); p.setFontSize(9); p.setTextColor(91, 102, 112);
      const fim = p.splitTextToSize(`Proposta válida por ${validade} dias. ${cond ? cond + " " : ""}Valores sujeitos à confirmação após o alinhamento de escopo. Esta proposta é opcional: a empresa pode decidir livremente se e quando executar as ações.`, 180);
      p.text(fim, 15, Math.min(z + 6, 275));
    } else {
      const y2 = y + 6 + nt.length * 4.2 + 6; if (y2 > 275) { p.addPage(); y = 14; }
      const f = p.splitTextToSize("Este material é um diagnóstico. A empresa decide livremente se, como e quando agir sobre os resultados. A Kairós está à disposição para apoiar, se desejado.", 180);
      p.setTextColor(22, 40, 60); p.setFontSize(9.5); p.text(f, 15, y2 > 275 ? 22 : y2);
    }
    p.save(`Relatorio_${d.empresa.replace(/\s+/g, "_")}${modo === "orc" ? "_com_proposta" : ""}.pdf`);
  }

  const box: React.CSSProperties = { background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 16, margin: "12px 0" };
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <a href="/kp/painel">← Voltar</a>
      <h1>{d.empresa}{d.grupo ? ` | ${d.grupo}` : ""}</h1>
      <p>Respondentes: <b>{d.n}</b> <label style={{ marginLeft: 12 }}><input type="checkbox" checked={teste} onChange={(e) => setTeste(e.target.checked)} /> Modo teste (libera com menos de {d.min ?? 5})</label></p>
      {d.bloqueado ? (
        <div style={{ ...box, background: "#f6efdd" }}>Resultado protegido: são necessários ao menos <b>{d.min} respondentes</b> para garantir o anonimato.</div>
      ) : (<>
        <div style={box}><h3>Índice geral de exposição</h3>
          <div style={{ fontSize: 34, fontWeight: 700, color: COR[lvl(d.geral)] }}>{d.geral.toFixed(2)} <small style={{ fontSize: 16 }}>{NIVEL[lvl(d.geral)]}</small></div>
          <small>Escala de 1 a 5, em que valores maiores indicam maior exposição ao risco (referência Kairós).</small></div>
        <div style={box}><h3>Resultado por fator</h3>
          {DIM.map((x, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "170px 1fr 110px", gap: 8, alignItems: "center", margin: "8px 0", fontSize: 13 }}>
              <span>{x[0]}</span>
              <div style={{ height: 12, background: "#d9dde2", borderRadius: 6 }}><div style={{ height: "100%", width: `${(d.medias[i] / 5) * 100}%`, background: COR[lvl(d.medias[i])], borderRadius: 6 }} /></div>
              <b style={{ color: COR[lvl(d.medias[i])], textAlign: "right" }}>{d.medias[i].toFixed(2)} {NIVEL[lvl(d.medias[i])]}</b>
            </div>))}</div>
        <div style={box}><h3>Plano de ação sugerido</h3>
          {plano.length ? plano.map((i: number) => <p key={i}><b style={{ color: COR[lvl(d.medias[i])] }}>{DIM[i][0]} ({NIVEL[lvl(d.medias[i])]}):</b> {DIM[i][2]}</p>) : <p>Nenhum fator em nível moderado ou superior.</p>}
          {lvl(d.medias[7]) >= 1 && <p style={{ background: "#f6efdd", padding: 10, borderRadius: 6 }}><b>Atenção:</b> o fator “Respeito e conduta” indica possíveis situações de desrespeito. Acione o protocolo de acolhimento e oriente a empresa a buscar apoio jurídico, sem retaliação.</p>}</div>
        {d.comentarios.length > 0 && <div style={box}><h3>Comentários anônimos</h3>{d.comentarios.map((c: string, i: number) => <p key={i} style={{ color: "#5b6670" }}>“{c}”</p>)}</div>}
        <div style={box}><h3>Orçamento</h3>
          <label style={{ display: "block", margin: "6px 0" }}><input type="radio" checked={modo === "diag"} onChange={() => setModo("diag")} /> <b>Somente diagnóstico</b> (a empresa decide depois, sem proposta no PDF)</label>
          <label style={{ display: "block", margin: "6px 0" }}><input type="radio" checked={modo === "orc"} onChange={() => setModo("orc")} /> <b>Diagnóstico + orçamento</b> (acrescenta uma página de proposta ao PDF)</label>
          {modo === "orc" && (<div style={{ marginTop: 10 }}>
            <small style={{ color: "#5b6670" }}>Frentes sugeridas a partir dos fatores em nível moderado ou pior. Desmarque o que não quiser e informe os valores; deixe em branco para “Sob consulta”.</small>
            {itens.length === 0 && <p>Nenhum fator em nível moderado ou superior: não há frentes a sugerir.</p>}
            {itens.map((i, k) => (<div key={k} style={{ borderTop: "1px solid #d9dde2", padding: "8px 0" }}>
              <label><input type="checkbox" checked={i.inc} onChange={(e) => setItens(itens.map((x, j) => (j === k ? { ...x, inc: e.target.checked } : x)))} /> <b>{i.servico}</b></label><br />
              <small style={{ color: "#5b6670" }}>{i.motivo}</small><br />
              R$ <input value={i.valor} placeholder="ex.: 2500,00" onChange={(e) => setItens(itens.map((x, j) => (j === k ? { ...x, valor: e.target.value } : x)))} style={{ padding: 6, border: "1px solid #d9dde2", borderRadius: 6, width: 130 }} /></div>))}
            <p>Desconto (%): <input type="number" min={0} max={100} value={desc} onChange={(e) => setDesc(+e.target.value)} style={{ width: 60, padding: 6 }} /> &nbsp; Validade (dias): <input type="number" min={1} value={validade} onChange={(e) => setValidade(+e.target.value)} style={{ width: 60, padding: 6 }} /></p>
            <textarea placeholder="Condições de pagamento e observações (opcional)" value={cond} onChange={(e) => setCond(e.target.value)} rows={2} style={{ width: "100%", padding: 8, border: "1px solid #d9dde2", borderRadius: 8 }} />
            <p><b>Total estimado: {brl(itens.filter((i) => i.inc).reduce((s, i) => s + num(i.valor), 0) * (1 - desc / 100))}</b></p></div>)}</div>
        <button onClick={pdf} style={{ padding: "11px 18px", borderRadius: 8, background: "#16283c", color: "#fff", fontWeight: 600, border: 0 }}>{modo === "orc" ? "Baixar relatório com proposta (PDF)" : "Baixar relatório do diagnóstico (PDF)"}</button>
      </>)}
    </main>
  );
}
