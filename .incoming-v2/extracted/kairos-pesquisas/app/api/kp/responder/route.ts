import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/kp/db";
import { tokenOk } from "@/lib/kp/auth";
import { TOTAL_ITENS } from "@/lib/kp/dimensoes";

const erro = (msg: string, status = 400) => NextResponse.json({ erro: msg }, { status });

export async function POST(req: NextRequest) {
  const { id, t, a, c } = await req.json().catch(() => ({}));
  if (!id || !t || !a) return erro("dados");
  const { data: s } = await db.from("kp_sessoes").select("*").eq("id", id).single();
  if (!s) return erro("sessao", 404);
  if (!s.aberta || (s.expira_em && new Date(s.expira_em) < new Date())) return erro("encerrada", 403);
  if (!tokenOk(id, s.renovar_seg, t)) return erro("qr_expirado", 403);
  if ((await cookies()).has("r_" + id)) return erro("ja_respondeu", 409);
  if (s.limite) {
    const { count } = await db.from("kp_respostas").select("id", { count: "exact", head: true }).eq("sessao_id", id);
    if ((count ?? 0) >= s.limite) return erro("limite", 403);
  }
  const ks = Object.keys(a);
  if (ks.length !== TOTAL_ITENS || ks.some((k) => !/^\d+-\d+$/.test(k) || ![1, 2, 3, 4, 5].includes(a[k]))) return erro("respostas");
  const com = typeof c === "string" ? c.slice(0, 500) : null;
  const { error } = await db.from("kp_respostas").insert({ sessao_id: id, respostas: a, comentario: com });
  if (error) return erro("gravacao", 500);
  const res = NextResponse.json({ ok: true });
  res.cookies.set("r_" + id, "1", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res; // nenhum IP ou dado do aparelho é guardado
}
