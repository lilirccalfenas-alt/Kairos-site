import { cookies } from "next/headers";
import { db } from "@/lib/kp/db";
import { tokenOk } from "@/lib/kp/auth";
import Form from "@/components/kp/FormPesquisa";

export const dynamic = "force-dynamic";
const Aviso = ({ t, d }: { t: string; d: string }) => (
  <main style={{ maxWidth: 480, margin: "15vh auto", padding: 24, textAlign: "center", fontFamily: "system-ui" }}>
    <h1 style={{ color: "#16283c" }}>{t}</h1><p style={{ color: "#5b6670" }}>{d}</p>
  </main>
);

export default async function Page({ params, searchParams }: any) {
  const { id } = await params;
  const { t } = await searchParams;
  const { data: s } = await db.from("kp_sessoes").select("*").eq("id", id).single();
  if (!s) return <Aviso t="Pesquisa não encontrada" d="Verifique o QR code." />;
  if (!s.aberta || (s.expira_em && new Date(s.expira_em) < new Date())) return <Aviso t="Pesquisa encerrada" d="Esta aplicação não recebe mais respostas." />;
  if (!t || !tokenOk(id, s.renovar_seg, t)) return <Aviso t="QR code expirado" d="Escaneie novamente o QR code exibido na tela." />;
  if ((await cookies()).has("r_" + id)) return <Aviso t="Resposta já registrada" d="Obrigado! Cada pessoa responde uma única vez." />;
  return <Form id={id} t={t} empresa={s.empresa} grupo={s.grupo} />;
}
