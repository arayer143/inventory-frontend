import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /products, /products/1)
  const pathname = request.nextUrl.pathname

  // If it's an API route, add the auth token and rewrite to the Go API
  if (pathname.startsWith("/api")) {
    // Clone the request headers and set a new header `Authorization`
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("Authorization", process.env.NEXT_PUBLIC_AUTH_TOKEN || "")

    // Create a new URL for the API request
    const url = new URL(pathname, process.env.NEXT_PUBLIC_API_URL)

    // Rewrite the request to the Go API
    return NextResponse.rewrite(url, {
      request: {
        headers: requestHeaders,
      },
    })
  }

  // If it's not an API route, don't do anything
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/api/:path*",
}

