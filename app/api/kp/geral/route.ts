import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/kp/db";
import { isAdmin } from "@/lib/kp/auth";

// Resumo de TODOS os apps para a página inicial da consultora.
export async function GET() {
  if (!isAdmin((await cookies()).get("kp_admin")?.value)) return NextResponse.json({ erro: "nao autorizado" }, { status: 401 });
  const [ss, vs, rs, cs, tal, novos] = await Promise.all([
    db.from("kp_sessoes").select("id,empresa,grupo,tipo,aberta,criado_em,kp_respostas(count)").order("criado_em", { ascending: false }).limit(50),
    db.from("kp_vagas").select("id,titulo,empresa,aberta,criado_em,kp_candidatos(count)").order("criado_em", { ascending: false }).limit(50),
    db.from("kp_respostas").select("sessao_id,criado_em").order("criado_em", { ascending: false }).limit(10),
    db.from("kp_candidatos").select("id,nome,vaga_id,criado_em").order("criado_em", { ascending: false }).limit(10),
    db.from("kp_candidatos").select("id", { count: "exact", head: true }).eq("banco_talentos", true),
    db.from("kp_candidatos").select("id", { count: "exact", head: true }).eq("status", "novo"),
  ]);
  const sessoes = (ss.data ?? []).map((s: any) => ({ ...s, n: s.kp_respostas?.[0]?.count ?? 0 }));
  const vagas = (vs.data ?? []).map((v: any) => ({ ...v, n: v.kp_candidatos?.[0]?.count ?? 0 }));
  const emp = Object.fromEntries(sessoes.map((s: any) => [s.id, s.empresa]));
  const vt = Object.fromEntries(vagas.map((v: any) => [v.id, v.titulo]));
  const atividades = [
    ...(rs.data ?? []).map((r: any) => ({ quando: r.criado_em, texto: `Nova resposta de pesquisa${emp[r.sessao_id] ? " (" + emp[r.sessao_id] + ")" : ""}`, href: `/kp/painel/resultados/${r.sessao_id}` })),
    ...(cs.data ?? []).map((c: any) => ({ quando: c.criado_em, texto: `Nova candidatura: ${c.nome}${vt[c.vaga_id] ? " (" + vt[c.vaga_id] + ")" : ""}`, href: `/kp/painel/vagas/${c.vaga_id}` })),
  ].sort((a, b) => +new Date(b.quando) - +new Date(a.quando)).slice(0, 10);
  return NextResponse.json({
    kpis: {
      pesquisasAbertas: sessoes.filter((s: any) => s.aberta).length,
      respostas: sessoes.reduce((a: number, s: any) => a + s.n, 0),
      vagasAbertas: vagas.filter((v: any) => v.aberta).length,
      candidatos: vagas.reduce((a: number, v: any) => a + v.n, 0),
      candidatosNovos: novos.count ?? 0,
      talentos: tal.count ?? 0,
    },
    sessoes, vagas, atividades,
  });
}
