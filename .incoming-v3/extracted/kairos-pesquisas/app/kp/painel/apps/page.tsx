import { APPS } from "@/lib/kp/apps";

export default function Central() {
  const box: React.CSSProperties = { background: "#fff", border: "1px solid #d9dde2", borderRadius: 12, padding: 16 };
  return (
    <main style={{ maxWidth: 820, margin: "0 auto", padding: 16, fontFamily: "system-ui", color: "#16283c" }}>
      <h1>Aplicativos Kairós</h1>
      <p style={{ color: "#5b6670" }}>Ferramentas da consultora, ligadas ao site. Você entra uma vez com a sua senha e usa todas.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
        {APPS.map((a) => (
          <div key={a.id} style={{ ...box, opacity: a.pronto ? 1 : 0.65, borderTop: `3px solid ${a.pronto ? "#c9a24a" : "#d9dde2"}` }}>
            <h3 style={{ margin: "0 0 6px" }}>{a.nome}</h3>
            <p style={{ fontSize: 13, color: "#5b6670", margin: "0 0 10px" }}>{a.desc}</p>
            {a.pronto ? <a href={a.href}>Abrir</a> : <small>Em breve</small>}
          </div>
        ))}
      </div>
    </main>
  );
}
