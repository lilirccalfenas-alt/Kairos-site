import { NextRequest, NextResponse } from "next/server";
import { adminCookieValue } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { pw } = await req.json().catch(() => ({ pw: "" }));
  if (!pw || pw !== process.env.ADMIN_PASSWORD) return NextResponse.json({ erro: "senha" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("kp_admin", adminCookieValue(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 12 });
  return res;
}
