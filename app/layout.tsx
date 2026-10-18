import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import './client-portal.css'
import { companyName, metadataDescription } from '@/lib/site-data'

export const metadata: Metadata = {
  title: { default: 'Kairós Gestão e Liderança | RH para pequenas empresas em Alfenas e Sul de Minas', template: `%s | ${companyName}` },
  description: 'Gestão de pessoas, desenvolvimento de líderes e tecnologia para pequenas empresas em Alfenas, Sul de Minas e todo o Brasil.',
  keywords: ['gestão de pessoas', 'liderança', 'RH', 'Alfenas', 'Sul de Minas', 'Minas Gerais'],
  metadataBase: new URL('https://kairosrhgestao.com.br'),
  openGraph: { title: 'Kairós Gestão e Liderança | RH para pequenas empresas em Alfenas e Sul de Minas', description: metadataDescription, locale: 'pt_BR', type: 'website', images: [{ url: 'https://kairosrhgestao.com.br/og-image-kairos.png', width: 1200, height: 630, alt: 'Kairós Gestão e Liderança: o tempo de transformar sua empresa é agora.' }] },
  twitter: { card: 'summary_large_image', title: 'Kairós Gestão e Liderança | RH para pequenas empresas em Alfenas e Sul de Minas', description: metadataDescription, images: ['https://kairosrhgestao.com.br/og-image-kairos.png'] },
  icons: { icon: '/icon.png', apple: '/icon.png' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#16283C', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="bg-soft"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
