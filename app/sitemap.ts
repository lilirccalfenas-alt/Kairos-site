import type { MetadataRoute } from 'next'

const baseUrl = 'https://kairosrhgestao.com.br'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/treinamentos', '/area-do-cliente', '/servicos', '/solucoes/gestao-de-pessoas', '/solucoes/clima-organizacional', '/solucoes/onboarding', '/solucoes/desenvolvimento-de-liderancas', '/solucoes/avaliacao-de-desempenho', '/solucoes/treinamentos', '/solucoes/consultoria-de-rh', '/solucoes/portal-empresarial', '/privacidade', '/termos', '/cookies']
  return routes.map((route) => ({ url: `${baseUrl}${route}`, lastModified: new Date(), changeFrequency: route === '' ? 'weekly' : 'monthly', priority: route === '' ? 1 : 0.7 }))
}

export const dynamic = 'force-static'
