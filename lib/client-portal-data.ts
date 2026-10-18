export type Plan = 'Essencial' | 'Evolução' | 'Transformação'
export type PortalModule = 'overview' | 'colaboradores' | 'onboarding' | 'clima' | 'comunicados' | 'desenvolvimento' | 'relatorios' | 'documentos'

export type Collaborator = { id: string; name: string; role: string; area: string; onboarding: number }
export type Notice = { id: string; title: string; text: string; date: string }
export type DevelopmentItem = { id: string; collaborator: string; type: string; text: string; progress: number }

export const portalClient = { company: 'Horizonte Tecnologia', contact: 'Mariana Costa', plan: 'Evolução' as Plan }

export const initialCollaborators: Collaborator[] = [
  { id: '1', name: 'Ana Paula Ribeiro', role: 'Analista de Pessoas', area: 'Administrativo', onboarding: 100 },
  { id: '2', name: 'Bruno Mendes', role: 'Coordenador Comercial', area: 'Comercial', onboarding: 60 },
  { id: '3', name: 'Camila Souza', role: 'Assistente Financeiro', area: 'Financeiro', onboarding: 40 },
]

export const initialNotices: Notice[] = [
  { id: '1', title: 'Encontro mensal de resultados', text: 'Nossa reunião de resultados acontece na próxima sexta-feira, às 9h.', date: '12/03/2025' },
  { id: '2', title: 'Novo benefício disponível', text: 'O benefício de bem-estar já está disponível para todo o time.', date: '04/03/2025' },
]

export const initialDevelopment: DevelopmentItem[] = [
  { id: '1', collaborator: 'Bruno Mendes', type: 'Meta', text: 'Aumentar conversão do time comercial em 15%', progress: 68 },
  { id: '2', collaborator: 'Camila Souza', type: 'PDI', text: 'Concluir trilha de Excel avançado', progress: 35 },
]

export const planLimits: Record<Plan, number> = { Essencial: 10, 'Evolução': 30, Transformação: 100 }
export const planRank: Record<Plan, number> = { Essencial: 1, 'Evolução': 2, Transformação: 3 }
export const isPlanAvailable = (current: Plan, required: Plan) => planRank[current] >= planRank[required]
