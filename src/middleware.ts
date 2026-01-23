import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Define paths that don't require authentication
  const publicPaths = ['/login', '/api/login']
  
  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Also allow static files and Next.js internals to pass through
  // The matcher in config handles most of this, but double check here if needed
  // or rely on the matcher.
  
  const authenticated = request.cookies.get('admin_authenticated')

  if (!authenticated || authenticated.value !== 'true') {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (usually served from root, but we can't easily glob them all)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}
