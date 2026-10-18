import { DIM } from "./dimensoes";
export type Item = { servico: string; motivo: string; inc: boolean; valor: string };
const NIV = ["Baixo", "Moderado", "Alto", "Crítico"];
const lvl = (m: number) => (m < 2 ? 0 : m < 3 ? 1 : m < 4 ? 2 : 3);
// fator (mesma ordem de DIM) -> serviço Kairós sugerido. Ajuste à vontade.
const SERV = [
  "Consultoria de RH", "Desenvolvimento de Lideranças", "Implantação de RH (cargos e responsabilidades)",
  "Mentoria para líderes", "Treinamento: Comunicação no trabalho", "Avaliação de Desempenho e reconhecimento",
  "Treinamento: Comunicação no trabalho", "Investigação organizacional e política de conduta",
  "Consultoria de RH", "Consultoria sob medida",
];
// Sugere frentes de trabalho a partir dos fatores em nível Moderado ou pior, do mais crítico ao menos.
export function sugerir(medias: number[]): Item[] {
  const g: Record<string, string[]> = {};
  medias.map((m, i) => i).filter((i) => lvl(medias[i]) >= 1).sort((a, b) => medias[b] - medias[a])
    .forEach((i) => { (g[SERV[i]] ||= []).push(`${DIM[i][0]} (${NIV[lvl(medias[i])]})`); });
  return Object.entries(g).map(([servico, f]) => ({ servico, motivo: "Fatores: " + f.join(", "), inc: true, valor: "" }));
}
