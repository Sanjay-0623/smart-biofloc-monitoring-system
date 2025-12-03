import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isPublicPath =
    path === "/" ||
    path.startsWith("/auth/") ||
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/_next") ||
    path.match(/\.(ico|png|jpg|jpeg|svg|gif|webp)$/)

  if (isPublicPath) {
    return NextResponse.next()
  }

  // Check authentication for protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  console.log("[v0] Middleware check for path:", path, "Token exists:", !!token)

  if (!token) {
    console.log("[v0] No token found, redirecting to login")
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
