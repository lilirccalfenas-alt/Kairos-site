export const companyName = 'Kairós Gestão e Liderança'
export const slogan = 'Um novo conceito de ser melhor.'
export const companyPromise = 'RH profissional sem precisar montar um departamento de RH.'
export const heroTitle = 'O tempo de transformar sua empresa é agora.'
export const heroSubtitle = 'Gestão de pessoas, desenvolvimento de líderes e tecnologia em uma única plataforma.'
export const story = 'A Kairós nasceu da compreensão de que o tempo é um dos recursos mais valiosos da vida. Acreditamos no poder da transformação e no potencial de cada pessoa para recomeçar, desenvolver suas habilidades e construir novas possibilidades. Nosso propósito é ajudar pessoas e empresas a encontrarem caminhos para o crescimento, a motivação e o desenvolvimento, por meio de uma gestão mais humana, estratégica e consciente.'
export const kairosDefinition = 'Na filosofia grega, Kairós é o tempo oportuno: o momento certo de agir, diferente de Chronos, o tempo que apenas passa.'
// Textos iniciais de missão, visão e valores: revisar com a Kairós antes da publicação.
export const mission = 'Ajudar pessoas e empresas a encontrarem caminhos para o crescimento, a motivação e o desenvolvimento, por meio de uma gestão mais humana, estratégica e consciente.'
export const vision = 'Ser referência em gestão de pessoas e desenvolvimento de lideranças para pequenas empresas em Minas Gerais e no Brasil.'
export const values = [
  { name: 'Humanidade', description: 'Pessoas em primeiro lugar.' },
  { name: 'Tempo oportuno', description: 'Agir no momento certo.' },
  { name: 'Transformação', description: 'Acreditar no potencial de cada pessoa.' },
  { name: 'Ética e sigilo', description: 'Cuidado com dados e confidências.' },
  { name: 'Proximidade', description: 'Atendimento próximo e acolhedor.' },
  { name: 'Excelência', description: 'Rigor e qualidade no que entregamos.' },
] as const
export const solutions = [
  ['Gestão de Pessoas', 'Processos claros para cuidar de quem faz sua empresa acontecer.', 'Users'],
  ['Clima Organizacional', 'Entenda o ambiente e transforme escuta em ação.', 'HeartHandshake'],
  ['Onboarding', 'Receba novos talentos com acolhimento e direção desde o primeiro dia.', 'Sparkles'],
  ['Desenvolvimento de Lideranças', 'Líderes mais preparados para decisões mais humanas.', 'Compass'],
  ['Avaliação de Desempenho', 'Acompanhe evolução com conversas que geram crescimento.', 'ChartNoAxesCombined'],
  ['Treinamentos', 'Aprendizado aplicado à realidade do seu negócio.', 'GraduationCap'],
  ['Consultoria de RH', 'Estratégia e experiência sem precisar montar um departamento.', 'Lightbulb'],
  ['Portal Empresarial', 'Tecnologia simples para organizar a rotina de pessoas.', 'MonitorSmartphone'],
] as const
export const solutionSlugs = ['gestao-de-pessoas', 'clima-organizacional', 'onboarding', 'desenvolvimento-de-liderancas', 'avaliacao-de-desempenho', 'treinamentos', 'consultoria-de-rh', 'portal-empresarial'].map((slug) => ({ slug }))
export const solutionDetails = [
  { slug: 'gestao-de-pessoas', title: 'Gestão de Pessoas', description: 'Organizamos os processos de pessoas da sua empresa, do cadastro ao desligamento, para você cuidar de quem faz o negócio acontecer.', benefits: ['Rotinas de RH claras e documentadas', 'Menos retrabalho e menos risco trabalhista', 'Mais tempo para o que importa no seu negócio'] },
  { slug: 'clima-organizacional', title: 'Clima Organizacional', description: 'Pesquisas simples para ouvir sua equipe e transformar o que ela diz em ações práticas.', benefits: ['Visão clara de satisfação, comunicação e liderança', 'Resultados por grupo, preservando o anonimato', 'Plano de ação com prioridades'] },
  { slug: 'onboarding', title: 'Onboarding', description: 'Uma jornada de integração para o novo colaborador se sentir acolhido e produtivo desde o primeiro dia.', benefits: ['Checklist de admissão e apresentação da cultura', 'Políticas e documentos com confirmação de leitura', 'Acompanhamento da adaptação nos primeiros meses'] },
  { slug: 'desenvolvimento-de-liderancas', title: 'Desenvolvimento de Lideranças', description: 'Apoio para líderes tomarem decisões mais humanas e conduzirem equipes com clareza.', benefits: ['Avaliação do perfil de liderança', 'Trilhas e planos de desenvolvimento', 'Mentoria e acompanhamento da evolução'] },
  { slug: 'avaliacao-de-desempenho', title: 'Avaliação de Desempenho', description: 'Conversas estruturadas sobre desempenho, com metas e feedbacks que geram crescimento.', benefits: ['Avaliações por competências e autoavaliação', 'Metas claras e acompanhamento de evolução', 'Feedbacks que apoiam o plano de desenvolvimento individual'] },
  { slug: 'treinamentos', title: 'Treinamentos', description: 'Capacitações presenciais e online aplicadas à realidade do seu negócio.', benefits: ['Conteúdos sob medida para a sua equipe', 'Acompanhamento de participação e aprendizado', 'Presencial em Alfenas e região, ou online'] },
  { slug: 'consultoria-de-rh', title: 'Consultoria de RH', description: 'Estratégia e experiência de RH, sem a necessidade de montar um departamento.', benefits: ['Diagnóstico da situação atual', 'Implantação de rotinas e políticas', 'Apoio contínuo conforme a necessidade'] },
  { slug: 'portal-empresarial', title: 'Portal Empresarial', description: 'Plataforma digital para organizar a rotina de pessoas em um só lugar.', benefits: ['Cadastro de colaboradores, onboarding e pesquisas', 'Comunicados internos e relatórios', 'Acesso seguro por perfil'], comingSoon: true },
] as const
export const segments = ['Comércio', 'Indústria', 'Agro', 'Saúde', 'Serviços', 'Educação']
export const steps = [
  ['01', 'Converse com a gente', 'Conte o momento da sua empresa e os desafios que quer superar.'],
  ['02', 'Receba um diagnóstico', 'Construímos uma visão clara das prioridades e possibilidades.'],
  ['03', 'Transforme com apoio', 'Você coloca em prática com método, tecnologia e parceria.'],
] as const
export const plans = [
  { name: 'Essencial', price: 149, limit: 'até 10 colaboradores', description: 'O ponto de partida para profissionalizar sua gestão.', features: ['Cadastro de colaboradores', 'Onboarding digital', 'Pesquisas de clima básicas', 'Comunicados internos', 'Relatórios essenciais'] },
  { name: 'Evolução', price: 349, limit: 'até 30 colaboradores', description: 'Mais clareza para desenvolver pessoas e resultados.', recommended: true, features: ['Tudo do Essencial', 'Avaliação de desempenho', 'Feedbacks e metas', 'Indicadores de RH', 'PDI e trilhas de aprendizagem'] },
  { name: 'Transformação', price: 699, limit: 'até 100 colaboradores', description: 'Uma visão estratégica para empresas em movimento.', features: ['Tudo do Evolução', 'Avaliação de lideranças', 'Pesquisas avançadas', 'Relatórios estratégicos', 'Painel executivo', 'Treinamentos personalizados', 'Suporte prioritário'] },
]
export const additionalServices = ['Consultoria sob medida', 'Mentoria para líderes', 'Treinamentos presenciais e online', 'Diagnósticos organizacionais', 'Implantação de RH']
export const additionalServiceDetails = [
  { slug: 'consultoria-sob-medida', title: 'Consultoria sob medida', description: 'Apoio estratégico de RH para os desafios específicos da sua empresa.' },
  { slug: 'mentoria-para-lideres', title: 'Mentoria para líderes', description: 'Acompanhamento individual para desenvolver a liderança com clareza e segurança.' },
  { slug: 'treinamentos-presenciais-e-online', title: 'Treinamentos presenciais e online', description: 'Capacitações aplicadas à realidade da sua equipe, em Alfenas e região ou à distância.' },
  { slug: 'diagnosticos-organizacionais', title: 'Diagnósticos organizacionais', description: 'Um retrato claro do clima, da liderança e dos processos de pessoas da sua empresa.' },
  { slug: 'implantacao-de-rh', title: 'Implantação de RH', description: 'Estruturamos as rotinas, políticas e ferramentas de RH que sua empresa ainda não tem.' },
] as const
export const courses = [
  { title: 'Liderança na prática', description: 'Desenvolver líderes para conduzir equipes com clareza e humanidade.', modality: 'Presencial ou online' },
  { title: 'Feedback que desenvolve', description: 'Como dar e receber feedback de forma construtiva.', modality: 'Presencial ou online' },
  { title: 'Cultura e clima organizacional', description: 'Construir um ambiente de trabalho saudável e engajado.', modality: 'Presencial' },
  { title: 'Comunicação no trabalho', description: 'Conversas claras que evitam conflitos e retrabalho.', modality: 'Presencial ou online' },
  { title: 'Gestão do tempo e produtividade', description: 'Organizar prioridades e rotinas da equipe.', modality: 'Online' },
  { title: 'Integração de novos colaboradores', description: 'Receber bem quem chega e acelerar a adaptação.', modality: 'Presencial ou online' },
] as const
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5535998678862'
export const contact = { city: 'Alfenas, MG' }
export const formattedWhatsappNumber = '(35) 99867-8862'
export const whatsappTelephone = '+55 35 99867-8862'
export const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de conhecer a Kairós Gestão e Liderança.')}`
export const navItems = [['Início', '#inicio'], ['Quem somos', '#quem-somos'], ['Soluções', '#solucoes'], ['Cursos', '/cursos'], ['Planos', '#planos'], ['Contato', '#contato']] as const
export const footerLinks = [['Política de Privacidade', '/privacidade'], ['Termos de Uso', '/termos'], ['Área do Cliente', '/area-do-cliente']] as const
export const displayCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const metadataDescription = 'Kairós Gestão e Liderança: gestão de pessoas, líderes e tecnologia para pequenas empresas em Alfenas, Sul de Minas e todo o Brasil.'
export const structuredData = { '@context': 'https://schema.org', '@type': 'LocalBusiness', name: companyName, telephone: whatsappTelephone, areaServed: ['Sul de Minas', 'Minas Gerais', 'Brasil'], address: { '@type': 'PostalAddress', addressLocality: 'Alfenas', addressRegion: 'MG', addressCountry: 'BR' } }
export const legalNotice = 'Modelo inicial. Este conteúdo deve ser revisado por um advogado antes da publicação.'
export const annualDiscount = 20
export const logoAlt = companyName
export const menuLabels = { open: 'Abrir menu de navegação', close: 'Fechar menu de navegação' }
export type IconName = typeof solutions[number][2]
export const getAnnualPrice = (price: number) => price * (1 - annualDiscount / 100)
export const getWhatsappLink = (message: string) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
export default { companyName, slogan, heroTitle, heroSubtitle, solutions, plans, contact, whatsappLink }
