import type { ReactNode } from "react";

export const metadata = { title: "Kairós | Painel", robots: { index: false, follow: false } };

// Padrão visual Kairós: azul-marinho #16283C, dourado e fundo claro (tema claro, como o site).
export default function PainelLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "#f5f3ee", minHeight: "100vh", color: "#16283c" }}>
      <style>{`
        .kp-hd{background:#16283c;color:#fff;padding:14px 20px;border-bottom:3px solid #c9a24a}
        .kp-hd b{font-size:20px;letter-spacing:1px}.kp-hd a{color:#fff;text-decoration-color:#c9a24a}.kp-hd span{display:block;font-size:12px;color:#e6ddc3}
        .kp-app button{background:#16283c;color:#fff;border:0;border-radius:8px;padding:9px 14px;font-weight:600;cursor:pointer}
        .kp-app button:disabled{opacity:.45;cursor:not-allowed}
        .kp-app a{color:#16283c;font-weight:600;text-decoration-color:#c9a24a}
        .kp-app input,.kp-app select{background:#fff;color:#16283c}
        .kp-app h1,.kp-app h2,.kp-app h3{color:#16283c}
      `}</style>
      <header className="kp-hd"><b>KAIRÓS</b><span>Gestão e Liderança</span><nav style={{ marginTop: 8, fontSize: 14 }}><a href="/painel">Pesquisas</a> {" | "} <a href="/painel/vagas">Recrutamento</a> {" | "} <a href="/painel/talentos">Banco de talentos</a></nav></header>
      <div className="kp-app">{children}</div>
    </div>
  );
}
