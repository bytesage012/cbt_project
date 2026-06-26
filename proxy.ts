import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Next.js 16: function must be named `proxy` (renamed from `middleware`)
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico   (browser icon)
     * - public folder files (svg, png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
