// CADASTRO DOS APPS KAIRÓS. Para criar um app novo: faça as páginas em app/kp/painel/<app>,
// APIs em app/api/kp/<app>, tabelas com prefixo kp_, e acrescente UMA linha aqui.
export type AppKP = { id: string; nome: string; menu: string; desc: string; href: string; pronto: boolean };
export const APPS: AppKP[] = [
  { id: "pesquisas", nome: "Clima e riscos psicossociais (NR-1)", menu: "Pesquisas", desc: "Pesquisa por QR code (fixo ou renovável), resultados por fator, plano de ação e relatório em PDF.", href: "/kp/painel", pronto: true },
  { id: "recrutamento", nome: "Recrutamento e entrevistas", menu: "Recrutamento", desc: "Teste de competências, entrevista estruturada, ranking de candidatos e relatório em PDF.", href: "/kp/painel/vagas", pronto: true },
  { id: "talentos", nome: "Banco de talentos", menu: "Banco de talentos", desc: "Candidatos que autorizaram guardar os dados, com busca por competência.", href: "/kp/painel/talentos", pronto: true },
  { id: "curriculos", nome: "Currículos", menu: "Currículos", desc: "Cadastro público de currículos com consentimento LGPD.", href: "/kp/painel/curriculos", pronto: true },
  { id: "anuncios", nome: "Anúncios de vagas", menu: "Anúncios", desc: "Receba, revise e publique vagas de empresas.", href: "/kp/painel/anuncios", pronto: true },
  { id: "maturidade", nome: "Maturidade de RH", menu: "Maturidade de RH", desc: "Diagnóstico respondido pelo dono: nota por área e plano indicado.", href: "", pronto: false },
  { id: "lideranca", nome: "Avaliação de lideranças 180/360", menu: "Lideranças", desc: "Autoavaliação, liderados e pares, com devolutiva individual.", href: "", pronto: false },
  { id: "cultura", nome: "Cultura e valores", menu: "Cultura", desc: "Diagnóstico de cultura para dono, líderes e equipe.", href: "", pronto: false },
  { id: "termometro", nome: "Termômetro rápido (palestras)", menu: "Termômetro", desc: "5 perguntas por QR code, resultado ao vivo na palestra.", href: "", pronto: false },
];
