import { META } from "./comp-meta";
// Teste (0-100) pesa 60% e entrevista (nota 1-5 -> 0-100) pesa 40%. Sem entrevista, vale só o teste.
export function calc(c: any, pesos: Record<string, number>) {
  const comp: Record<string, number> = {};
  META.forEach((k) => {
    const t = c.notas?.[k.id] ?? 0, e = c.entrevista?.[k.id];
    comp[k.id] = e ? Math.round(0.6 * t + 0.4 * ((e - 1) / 4) * 100) : Math.round(t);
  });
  let sw = 0, s = 0;
  META.forEach((k) => { const w = pesos?.[k.id] ?? 1; sw += w; s += w * comp[k.id]; });
  return { comp, ader: sw ? Math.round(s / sw) : 0 };
}
