import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { DIM } from "@/lib/dimensoes";

const MIN = 5; // anonimato mínimo
export async function GET(req: NextRequest) {
  if (!isAdmin((await cookies()).get("kp_admin")?.value)) return NextResponse.json({}, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  const teste = req.nextUrl.searchParams.get("teste") === "1";
  const { data: s } = await db.from("sessoes").select("empresa,grupo,tipo,criado_em").eq("id", id).single();
  if (!s) return NextResponse.json({}, { status: 404 });
  const { data: rs } = await db.from("respostas").select("respostas,comentario").eq("sessao_id", id);
  const R = rs ?? [], n = R.length;
  if (n < MIN && !teste) return NextResponse.json({ ...s, n, bloqueado: true, min: MIN });
  const medias = DIM.map((d, i) => {
    const por = R.map((r: any) => d[1].reduce((a, q, j) => a + (q[1] ? 6 - r.respostas[`${i}-${j}`] : r.respostas[`${i}-${j}`]), 0) / d[1].length);
    return n ? por.reduce((a, b) => a + b, 0) / n : 0;
  });
  const geral = n ? medias.reduce((a, b) => a + b, 0) / medias.length : 0;
  const comentarios = R.map((r: any) => r.comentario).filter(Boolean);
  return NextResponse.json({ ...s, n, bloqueado: false, teste: n < MIN, medias, geral, comentarios });
}
