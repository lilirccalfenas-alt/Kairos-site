import { db } from "@/lib/kp/db";
import { TESTE } from "@/lib/kp/comp-test";
import { META } from "@/lib/kp/comp-meta";
import FormVaga from "@/components/kp/FormVaga";

export const dynamic = "force-dynamic";
export const metadata = { title: "Kairós | Processo seletivo", robots: { index: false, follow: false } };

export default async function Page({ params }: any) {
  const { id } = await params;
  const { data: v } = await db.from("kp_vagas").select("titulo,empresa,aberta").eq("id", id).single();
  if (!v || !v.aberta) return <main style={{ padding: 40, fontFamily: "system-ui", textAlign: "center" }}><h1 style={{ color: "#16283c" }}>Vaga encerrada</h1><p>Este processo seletivo não recebe mais inscrições.</p></main>;
  // remove a pontuação antes de enviar ao navegador; guarda o índice original de cada alternativa
  const blocos = META.map((m) => ({ id: m.id, nome: m.nome, q: TESTE[m.id].map((q) => ({ t: q.t, o: q.o.map((x, i) => ({ i, t: x[0] })) })) }));
  return <FormVaga id={id} titulo={v.titulo} empresa={v.empresa} blocos={blocos} />;
}
