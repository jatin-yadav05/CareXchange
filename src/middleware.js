import { NextResponse } from 'next/server';

// Define protected routes and their allowed roles
const protectedRoutes = {
  '/donate': ['donor'],
  '/request': ['recipient'],
  '/profile': ['donor', 'recipient', 'admin'],
};

// Define public routes that should redirect to home if user is authenticated
const publicOnlyRoutes = ['/login', '/register'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get the token from the cookies
  const token = request.cookies.get('token');
  
  // Check if this is a protected route
  const isProtectedRoute = Object.keys(protectedRoutes).some(route => 
    pathname.startsWith(route)
  );

  // Check if this is a public-only route
  const isPublicOnlyRoute = publicOnlyRoutes.some(route => 
    pathname.startsWith(route)
  );

  // If there's no token and this is a protected route
  if (!token && isProtectedRoute) {
    const url = new URL('/login', request.url);
    url.searchParams.set('from', pathname);
    // Add message parameter for toast notification
    url.searchParams.set('message', 'Please login to access this feature');
    return NextResponse.redirect(url);
  }

  // If there is a token
  if (token) {
    try {
      // Get user data from the API
      const response = await fetch(`${request.nextUrl.origin}/api/auth/me`, {
        headers: {
          Cookie: `token=${token.value}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();

      // If user is logged in and tries to access public-only routes
      if (isPublicOnlyRoute) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // If this is a protected route, check role access
      if (isProtectedRoute) {
        const allowedRoles = protectedRoutes[
          Object.keys(protectedRoutes).find(route => pathname.startsWith(route))
        ];

        if (!allowedRoles.includes(userData.role)) {
          // Redirect to home page if user's role doesn't have access
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    } catch (error) {
      console.error('Middleware error:', error);
      // If there's an error verifying the token, clear it and redirect to login
      if (isProtectedRoute) {
        const url = new URL('/login', request.url);
        url.searchParams.set('from', pathname);
        url.searchParams.set('message', 'Your session has expired. Please login again');
        const response = NextResponse.redirect(url);
        response.cookies.delete('token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 