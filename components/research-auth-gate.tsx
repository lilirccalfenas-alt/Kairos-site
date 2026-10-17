'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'

export function ResearchAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    getSupabase().auth.getSession().then(({ data }) => {
      if (!active) return
      if (!data.session) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      else setReady(true)
    })
    return () => { active = false }
  }, [pathname, router])

  if (!ready) return <main className="survey-admin"><div className="survey-admin-inner"><p>Verificando acesso...</p></div></main>
  return children
}

export async function getResearchAccessToken() {
  const { data } = await getSupabase().auth.getSession()
  return data.session?.access_token || ''
}
