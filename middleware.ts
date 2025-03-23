import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for the authentication pages
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register") || pathname === "/"

  // Get the user's session
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })
  // We'll consider a user authenticated if they have a token
  const session = token ? { user: token } : null

  // If the user is not authenticated and trying to access a protected route
  if (!session && !isAuthPage && !pathname.startsWith("/api")) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // If the user is authenticated and trying to access an auth page
  if (session && isAuthPage && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}

