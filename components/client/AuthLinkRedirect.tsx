'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function AuthLinkRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname === '/area-do-cliente/definir-senha') return
    const hash = window.location.hash
    if (!hash) return
    const params = new URLSearchParams(hash.slice(1))
    const errorCode = params.get('error_code')
    const error = params.get('error')
    if (error || errorCode === 'otp_expired' || errorCode === 'access_denied') {
      router.replace(`/area-do-cliente/definir-senha${hash}`)
    }
  }, [pathname, router])

  return null
}
