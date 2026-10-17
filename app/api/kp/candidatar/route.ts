import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/kp/db";
import { TESTE } from "@/lib/kp/comp-test";

const erro = (m: string, s = 400) => NextResponse.json({ erro: m }, { status: s });
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}));
  if (!b.vaga || !b.nome?.trim() || !b.email?.includes("@") || b.lgpd !== true || !b.r) return erro("dados");
  const { data: v } = await db.from("kp_vagas").select("id,aberta").eq("id", b.vaga).single();
  if (!v || !v.aberta) return erro("encerrada", 403);
  const notas: Record<string, number> = {};
  for (const [cid, qs] of Object.entries(TESTE)) {
    let soma = 0;
    for (let q = 0; q < qs.length; q++) {
      const i = b.r[`${cid}-${q}`];
      if (!Number.isInteger(i) || !qs[q].o[i]) return erro("respostas");
      soma += qs[q].o[i][1];
    }
    notas[cid] = Math.round((((soma / qs.length) - 1) / 3) * 100);
  }
  const { error } = await db.from("kp_candidatos").insert({
    vaga_id: b.vaga, nome: b.nome.trim().slice(0, 120), email: b.email.trim().toLowerCase().slice(0, 120),
    telefone: b.telefone?.slice(0, 30) || null, cidade: b.cidade?.slice(0, 80) || null,
    banco_talentos: b.banco === true, respostas: b.r, notas,
  });
  if (error) return erro(error.code === "23505" ? "ja_candidatou" : "gravacao", error.code === "23505" ? 409 : 500);
  return NextResponse.json({ ok: true }); // o candidato não recebe a pontuação
}
