import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Redirect to onboarding if user hasn't completed it
    if (token && !path.startsWith("/onboarding") && !path.startsWith("/api") && !path.startsWith("/auth")) {
      // Check if user needs onboarding (this would be based on your business logic)
      // For now, we'll let users access their dashboards
    }

    // Role-based access control
    if (token) {
      const role = token.role

      // Admin routes
      if (path.startsWith("/admin") && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }

      // Ambassador routes
      if (path.startsWith("/ambassador") && role !== "AMBASSADOR" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }

      // Business routes
      if (path.startsWith("/business") && role as string !== "BUSINESS" && role as string !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }

      // Student/Expert routes (both can access)
      if ((path.startsWith("/student") || path.startsWith("/expert")) && 
          role !== "STUDENT" && role !== "EXPERT" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        const publicRoutes = ["/", "/jobs", "/opleidingen", "/auth"]
        const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
        
        if (isPublicRoute) return true
        
        // Require auth for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

