import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/kp/db";
import { isAdmin } from "@/lib/kp/auth";

const guard = async () => isAdmin((await cookies()).get("kp_admin")?.value);
const nao = () => NextResponse.json({ erro: "nao autorizado" }, { status: 401 });

export async function GET() {
  if (!(await guard())) return nao();
  const { data } = await db.from("kp_vagas").select("*, kp_candidatos(count)").order("criado_em", { ascending: false });
  return NextResponse.json(data ?? []);
}
export async function POST(req: NextRequest) {
  if (!(await guard())) return nao();
  const b = await req.json();
  if (!b.titulo?.trim()) return NextResponse.json({ erro: "titulo" }, { status: 400 });
  const { data, error } = await db.from("kp_vagas").insert({ titulo: b.titulo.trim(), empresa: b.empresa?.trim() || null, pesos: b.pesos }).select().single();
  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json(data);
}
export async function PATCH(req: NextRequest) {
  if (!(await guard())) return nao();
  const { id, aberta } = await req.json();
  await db.from("kp_vagas").update({ aberta: !!aberta }).eq("id", id);
  return NextResponse.json({ ok: true });
}
