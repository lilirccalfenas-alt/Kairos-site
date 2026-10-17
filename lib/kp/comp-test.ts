// SOMENTE SERVIDOR: contém a pontuação (1 a 4) de cada alternativa. Nunca importar em "use client".
type Q = { t: string; o: [string, number][] };
export const TESTE: Record<string, Q[]> = {
  com: [
    { t: "Você percebe que um colega entendeu errado uma orientação sua e já começou a executar.", o: [["Paro, explico de novo com calma e confirmo se ficou claro.", 4], ["Corrijo na hora e peço que ele refaça.", 3], ["Aviso a chefia sobre o erro dele.", 2], ["Digo que ele não prestou atenção.", 1]] },
    { t: "Um cliente chega nervoso e fala alto, reclamando.", o: [["Escuto até o fim, reconheço o problema e proponho uma solução.", 4], ["Explico as regras da empresa para ele entender.", 3], ["Passo o atendimento para um colega.", 2], ["Respondo no mesmo tom para me fazer respeitar.", 1]] },
  ],
  eq: [
    { t: "Um colega está sobrecarregado e você já terminou as suas tarefas.", o: [["Ofereço ajuda e combino com ele o que posso assumir.", 4], ["Aviso a chefia que ele precisa de apoio.", 3], ["Espero ele pedir ajuda.", 2], ["Aproveito para descansar, minhas tarefas acabaram.", 1]] },
    { t: "Em uma reunião, a sua ideia é recusada pelo grupo.", o: [["Pergunto os motivos e ajudo a melhorar a solução escolhida.", 4], ["Aceito a decisão e sigo com o grupo.", 3], ["Aceito, mas comento com outros que estão errados.", 2], ["Insisto até aceitarem a minha ideia.", 1]] },
  ],
  resp: [
    { t: "Você cometeu um erro que ainda ninguém percebeu.", o: [["Aviso a chefia, explico o que houve e proponho como corrigir.", 4], ["Corrijo discretamente e não comento.", 3], ["Espero para ver se alguém percebe.", 2], ["Deixo como está, o erro foi pequeno.", 1]] },
    { t: "É fim de expediente e falta terminar uma tarefa importante para o dia seguinte.", o: [["Combino com a chefia a melhor forma de concluir e cumpro o combinado.", 4], ["Termino, mesmo que precise ficar além do horário.", 3], ["Deixo para o dia seguinte e aviso só se perguntarem.", 2], ["Peço para um colega terminar.", 1]] },
  ],
  prob: [
    { t: "A máquina ou o sistema que você usa para trabalhar para de funcionar.", o: [["Verifico o que pode ser, tento uma solução simples e aciono o responsável com informações claras.", 4], ["Chamo o responsável imediatamente.", 3], ["Espero alguém perceber e resolver.", 2], ["Paro de trabalhar e aguardo orientação.", 1]] },
    { t: "Dois prazos importantes coincidem e não dá para entregar os dois.", o: [["Aviso a chefia, mostro as opções e peço a prioridade.", 4], ["Escolho o que considero mais importante e entrego.", 3], ["Tento fazer os dois e entrego com menos qualidade.", 2], ["Entrego o que der e não comento sobre o outro.", 1]] },
  ],
  adap: [
    { t: "A empresa muda um processo que você já dominava.", o: [["Peço treinamento, testo o novo jeito e dou sugestões.", 4], ["Aprendo com os colegas e sigo em frente.", 3], ["Faço do jeito novo só quando me cobram.", 2], ["Continuo no meu jeito, que já funciona.", 1]] },
    { t: "Você recebe uma tarefa fora da sua função habitual.", o: [["Pergunto o que é esperado, aprendo e faço o melhor possível.", 4], ["Faço, mas deixo claro que não é minha função.", 3], ["Peço para outra pessoa fazer.", 2], ["Recuso, não é a minha função.", 1]] },
  ],
  cli: [
    { t: "Um cliente pede algo que a empresa não oferece.", o: [["Explico com educação, ofereço a melhor alternativa e registro o pedido.", 4], ["Explico que não temos e peço desculpas.", 3], ["Indico que procure em outro lugar.", 2], ["Digo que isso não é comigo.", 1]] },
    { t: "Você descobre que um cliente foi prejudicado por uma falha da empresa.", o: [["Assumo o contato, peço desculpas e busco resolver com a chefia.", 4], ["Aviso a chefia para ela resolver.", 3], ["Espero o cliente reclamar.", 2], ["Não comento, para não criar problema.", 1]] },
  ],
};
