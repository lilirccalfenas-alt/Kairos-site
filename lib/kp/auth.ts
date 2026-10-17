import crypto from "crypto";
const h = (m: string) =>
  crypto.createHmac("sha256", process.env.APP_SECRET!).update(m).digest("base64url").slice(0, 22);

export const adminCookieValue = () => h("admin:" + process.env.ADMIN_PASSWORD);
export const isAdmin = (v?: string) => !!v && v === adminCookieValue();

// Token do QR. renovar = 0: fixo. renovar > 0: muda a cada N segundos (aceita a janela anterior).
export function tokenFor(id: string, renovar: number, back = 0) {
  if (!renovar) return h("q:" + id);
  return h(`q:${id}:${Math.floor(Date.now() / (renovar * 1000)) - back}`);
}
export const tokenOk = (id: string, renovar: number, t: string) =>
  t === tokenFor(id, renovar) || (renovar > 0 && t === tokenFor(id, renovar, 1));
