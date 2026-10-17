import { LegalPage, legalUpdatedAt, privacySections } from '@/components/legal-page'

export const metadata = { title: 'Política de Privacidade | Kairós' }

export default function PrivacyPage() {
  return <LegalPage title="Política de Privacidade" updatedAt={legalUpdatedAt} sections={privacySections} />
}
void metadata
void LegalPage
void legalUpdatedAt
void privacySections
