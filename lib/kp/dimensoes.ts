// [nome, [[texto, reverso?]], medida de controle sugerida]
// Referência Kairós (não é escala validada). Revisar antes do uso com clientes.
export const ESCALA = ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Sempre"];
export const DIM: [string, [string, number?][], string][] = [
  ["Demandas e sobrecarga", [["Tenho mais tarefas do que consigo concluir no meu horário."], ["Trabalho com prazos muito apertados."]], "Revisar distribuição de tarefas, metas e prazos; avaliar reforço de equipe."],
  ["Autonomia e controle", [["Posso decidir como organizar o meu trabalho.", 1], ["Sou ouvido(a) nas decisões que afetam a minha função.", 1]], "Ampliar a participação da equipe em decisões e na organização do trabalho."],
  ["Clareza de papéis", [["Sei exatamente o que esperam de mim.", 1], ["Recebo ordens ou metas contraditórias."]], "Descrever cargos, responsabilidades e metas; alinhar orientações entre chefias."],
  ["Apoio da liderança", [["Minha chefia me apoia quando tenho dificuldades.", 1], ["Minha chefia me trata com respeito.", 1]], "Capacitar líderes (feedback, escuta, 1:1) e acompanhar o clima da equipe."],
  ["Relações entre colegas", [["Posso contar com meus colegas quando preciso.", 1], ["Há conflitos frequentes na minha equipe."]], "Estabelecer combinados de convivência e mediação de conflitos."],
  ["Reconhecimento e justiça", [["Meu esforço é reconhecido.", 1], ["As regras e decisões são aplicadas de forma justa.", 1]], "Criar critérios claros de reconhecimento, promoção e aplicação de regras."],
  ["Comunicação e mudanças", [["Sou informado(a) com antecedência sobre mudanças que me afetam.", 1], ["As informações importantes chegam de forma confusa ou tardia."]], "Definir canais e ritos de comunicação; comunicar mudanças com antecedência."],
  ["Respeito e conduta", [["Presenciei ou sofri humilhação, gritos ou constrangimento no trabalho."], ["Sinto-me seguro(a) para relatar situações de desrespeito.", 1]], "Implantar canal de acolhimento e política de conduta; apurar relatos com apoio jurídico."],
  ["Jornada e equilíbrio", [["Levo preocupações ou tarefas do trabalho para o meu descanso."], ["Consigo fazer pausas e descansar conforme preciso.", 1]], "Revisar jornada, pausas, horas extras e disponibilidade fora do horário."],
  ["Segurança e condições", [["Tenho receio de perder o emprego sem aviso."], ["O ritmo, o ambiente e os recursos do meu trabalho são adequados.", 1]], "Melhorar condições e dar transparência sobre a situação da empresa."],
];
export const TOTAL_ITENS = DIM.reduce((n, d) => n + d[1].length, 0);
