import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/kp/db";
import { isAdmin, tokenFor } from "@/lib/kp/auth";

export async function GET(req: NextRequest) {
  if (!isAdmin((await cookies()).get("kp_admin")?.value)) return NextResponse.json({}, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  const { data: s } = await db.from("kp_sessoes").select("empresa,grupo,renovar_seg,aberta,limite").eq("id", id).single();
  if (!s) return NextResponse.json({}, { status: 404 });
  const { count } = await db.from("kp_respostas").select("id", { count: "exact", head: true }).eq("sessao_id", id);
  return NextResponse.json({ ...s, t: tokenFor(id, s.renovar_seg), n: count ?? 0 });
}
