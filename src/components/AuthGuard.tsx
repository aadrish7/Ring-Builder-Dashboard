'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

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

    // 2. Check for authentication flag in localStorage
    const isAuth = localStorage.getItem('is_admin_authenticated')

    if (!isAuth) {
      // 3. If not authenticated, redirect to login
      setAuthorized(false)
      router.push('/login')
    } else {
      // 4. If authenticated, allow rendering
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
