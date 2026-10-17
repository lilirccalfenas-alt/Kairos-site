export const escala = ['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'] as const
export const dimensoes = [
  ['Demandas e sobrecarga', ['Tenho mais tarefas do que consigo concluir no meu horário.', 'Trabalho com prazos muito apertados.']],
  ['Autonomia e controle', ['Posso decidir como organizar o meu trabalho.', 'Sou ouvido(a) nas decisões que afetam a minha função.']],
  ['Clareza de papéis', ['Sei exatamente o que esperam de mim.', 'Recebo ordens ou metas contraditórias.']],
  ['Apoio da liderança', ['Minha chefia me apoia quando tenho dificuldades.', 'Minha chefia me trata com respeito.']],
  ['Relações entre colegas', ['Posso contar com meus colegas quando preciso.', 'Há conflitos frequentes na minha equipe.']],
  ['Reconhecimento e justiça', ['Meu esforço é reconhecido.', 'As regras e decisões são aplicadas de forma justa.']],
  ['Comunicação e mudanças', ['Sou informado(a) com antecedência sobre mudanças que me afetam.', 'As informações importantes chegam de forma confusa ou tardia.']],
  ['Respeito e conduta', ['Presenciei ou sofri humilhação, gritos ou constrangimento no trabalho.', 'Sinto-me seguro(a) para relatar situações de desrespeito.']],
  ['Jornada e equilíbrio', ['Levo preocupações ou tarefas do trabalho para o meu descanso.', 'Consigo fazer pausas e descansar conforme preciso.']],
  ['Segurança e condições', ['Tenho receio de perder o emprego sem aviso.', 'O ritmo, o ambiente e os recursos do meu trabalho são adequados.']],
] as const
export const totalItens = dimensoes.reduce((total, [, items]) => total + items.length, 0)
