"use client";
import { useEffect, useState } from "react";

export default function Painel() {
  const [logado, setLogado] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [lista, setLista] = useState<any[]>([]);
  const [f, setF] = useState({ empresa: "", grupo: "", tipo: "palestra", renovar_seg: 120, limite: "" });
  async function carregar() {
    const r = await fetch("/api/kp/sessoes");
    if (r.status === 401) return setLogado(false);
    setLista(await r.json()); setLogado(true);
  }
  useEffect(() => { carregar(); }, []);
  async function entrar() {
    const r = await fetch("/api/kp/login", { method: "POST", body: JSON.stringify({ pw }) });
    r.ok ? carregar() : alert("Senha incorreta");
  }
  async function criar() {
    if (!f.empresa.trim()) return alert("Informe a empresa");
    await fetch("/api/kp/sessoes", { method: "POST", body: JSON.stringify({ ...f, limite: f.limite ? +f.limite : null }) });
    setF({ ...f, empresa: "", grupo: "", limite: "" }); carregar();
  }
  async function alternar(s: any) {
    await fetch("/api/kp/sessoes", { method: "PATCH", body: JSON.stringify({ id: s.id, aberta: !s.aberta }) }); carregar();
  }
  const box: React.CSSProperties = { background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 16, margin: "12px 0" };
  const inp: React.CSSProperties = { padding: 9, border: "1px solid #d9dde2", borderRadius: 8, margin: "4px 6px 4px 0" };
  if (logado === null) return null;
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <h1>Kairós | Painel de pesquisas</h1>
      {!logado ? (
        <div style={box}><input style={inp} type="password" placeholder="Senha" value={pw} onChange={(e) => setPw(e.target.value)} /><button onClick={entrar}>Entrar</button></div>
      ) : (<>
        <div style={box}>
          <h3>Nova aplicação (gera o QR code)</h3>
          <input style={inp} placeholder="Empresa" value={f.empresa} onChange={(e) => setF({ ...f, empresa: e.target.value })} />
          <input style={inp} placeholder="Grupo/setor (opcional)" value={f.grupo} onChange={(e) => setF({ ...f, grupo: e.target.value })} />
          <select style={inp} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}><option>palestra</option><option>consultoria</option><option>grupo</option></select>
          <select style={inp} value={f.renovar_seg} onChange={(e) => setF({ ...f, renovar_seg: +e.target.value })}>
            <option value={0}>QR fixo</option><option value={60}>Renova a cada 1 min</option><option value={120}>Renova a cada 2 min</option><option value={300}>Renova a cada 5 min</option>
          </select>
          <input style={inp} type="number" placeholder="Limite de respostas" value={f.limite} onChange={(e) => setF({ ...f, limite: e.target.value })} />
          <button onClick={criar}>Criar</button>
        </div>
        {lista.map((s) => (
          <div key={s.id} style={box}>
            <b>{s.empresa}</b>{s.grupo ? ` | ${s.grupo}` : ""} <small>({s.tipo}, {s.aberta ? "aberta" : "encerrada"}, {s.kp_respostas?.[0]?.count ?? 0} respostas)</small>
            <div style={{ marginTop: 8 }}>
              <a href={`/kp/painel/qr/${s.id}`} target="_blank">Exibir QR</a> {" | "}<a href={`/kp/painel/resultados/${s.id}`}>Resultados</a> {" | "}
              <button onClick={() => alternar(s)}>{s.aberta ? "Encerrar" : "Reabrir"}</button>
            </div>
          </div>
        ))}
      </>)}
    </main>
  );
}
