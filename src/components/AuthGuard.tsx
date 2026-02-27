'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[1]) : null
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1. Allow access to login page without check
    if (pathname === '/login') {
      setAuthorized(true)
      return
    }

    // 2. Check for auth token in cookie
    const token = getCookie('auth_token')

    if (!token) {
      setAuthorized(false)
      router.push('/login')
    } else {
      setAuthorized(true)
    }
  }, [pathname, router])

  // Prevent flash of protected content
  if (!authorized && pathname !== '/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
      </div>
    )
  }

  return <>{children}</>
}
