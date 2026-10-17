"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

export default function QR() {
  const { id } = useParams<{ id: string }>();
  const [s, setS] = useState<any>(null);
  const [url, setUrl] = useState("");
  useEffect(() => {
    let vivo = true;
    async function tick() {
      const r = await fetch(`/api/token?id=${id}`);
      if (!r.ok) return;
      const d = await r.json();
      if (!vivo) return;
      setS(d);
      setUrl(`${location.origin}/pesquisa/${id}?t=${d.t}`);
    }
    tick();
    const iv = setInterval(tick, 5000); // renova o QR e atualiza o contador de respostas
    return () => { vivo = false; clearInterval(iv); };
  }, [id]);
  return (
    <main style={{ position: "fixed", inset: 0, zIndex: 10, overflow: "auto", minHeight: "100vh", background: "#16283c", color: "#fff", display: "grid", placeItems: "center", fontFamily: "system-ui", textAlign: "center", padding: 16 }}>
      <div>
        <div style={{ color: "#c9a24a", fontWeight: 700, letterSpacing: 2 }}>KAIRÓS</div>
        <h1 style={{ margin: "6px 0" }}>Escaneie e responda a pesquisa</h1>
        <p style={{ color: "#e6ddc3" }}>{s?.empresa}{s?.grupo ? ` | ${s.grupo}` : ""}</p>
        <div style={{ background: "#fff", padding: 18, borderRadius: 16, display: "inline-block" }}>
          {url ? <QRCodeSVG value={url} size={Math.min(360, 300)} level="M" /> : <p style={{ color: "#16283c" }}>Carregando...</p>}
        </div>
        <p style={{ marginTop: 14 }}>Respostas recebidas: <b>{s?.n ?? 0}</b>{s?.limite ? ` de ${s.limite}` : ""}</p>
        <p style={{ color: "#aab5c0", fontSize: 13 }}>{!s ? "" : !s.aberta ? "Aplicação encerrada" : s.renovar_seg ? `O QR code se renova a cada ${s.renovar_seg}s` : "QR code fixo"}</p>
      </div>
    </main>
  );
}
