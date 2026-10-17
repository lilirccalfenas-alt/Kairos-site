import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/kp/db";
import { isAdmin } from "@/lib/kp/auth";
import { calc } from "@/lib/kp/recrut";

const guard = async () => isAdmin((await cookies()).get("kp_admin")?.value);
const nao = () => NextResponse.json({ erro: "nao autorizado" }, { status: 401 });

export async function GET(req: NextRequest) {
  if (!(await guard())) return nao();
  const vaga = req.nextUrl.searchParams.get("vaga");
  if (vaga) {
    const { data: v } = await db.from("kp_vagas").select("*").eq("id", vaga).single();
    const { data: cs } = await db.from("kp_candidatos").select("*").eq("vaga_id", vaga);
    return NextResponse.json({ vaga: v, candidatos: (cs ?? []).map(({ respostas, ...c }: any) => ({ ...c, ...calc(c, v?.pesos ?? {}) })) });
  }
  const { data: cs } = await db.from("kp_candidatos").select("*, kp_vagas(titulo)").eq("banco_talentos", true);
  return NextResponse.json((cs ?? []).map(({ respostas, ...c }: any) => ({ ...c, ...calc(c, {}) })));
}
export async function PATCH(req: NextRequest) {
  if (!(await guard())) return nao();
  const { id, entrevista, obs, status } = await req.json();
  await db.from("kp_candidatos").update({ entrevista, obs, status }).eq("id", id);
  return NextResponse.json({ ok: true });
}
export async function DELETE(req: NextRequest) { // exclusão de dados (LGPD)
  if (!(await guard())) return nao();
  const { id } = await req.json();
  await db.from("kp_candidatos").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
