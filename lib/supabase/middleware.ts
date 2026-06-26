import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, cacheHeaders) {
          // Apply cookies to the request (for Server Components downstream)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Rebuild the response so it carries the new cookies
          supabaseResponse = NextResponse.next({ request })
          // Apply cache headers to prevent CDN caching of auth responses
          if (cacheHeaders) {
            Object.entries(cacheHeaders).forEach(([key, value]) => {
              supabaseResponse.headers.set(key, value as string)
            })
          }
          // Write cookies to the browser
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Refresh the session. Do NOT remove this line.
  // getClaims() validates + refreshes the token if needed.
  await supabase.auth.getClaims()

  return supabaseResponse
}
