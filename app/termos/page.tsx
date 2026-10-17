import { LegalPage, legalUpdatedAt, termsSections } from '@/components/legal-page'

export const metadata = { title: 'Termos de Uso | Kairós' }

export default function TermsPage() {
  return <LegalPage title="Termos de Uso" updatedAt={legalUpdatedAt} sections={termsSections} />
}
void metadata
void LegalPage
void legalUpdatedAt
void termsSections
