import { LegalPage, cookieSections, legalUpdatedAt } from '@/components/legal-page'

export const metadata = { title: 'Aviso de Cookies | Kairós' }

export default function CookiesPage() {
  return <LegalPage title="Aviso de Cookies" updatedAt={legalUpdatedAt} sections={cookieSections} />
}
void metadata
void LegalPage
void cookieSections
void legalUpdatedAt
