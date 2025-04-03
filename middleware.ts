// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the secure cookie name (must match the one set in the API route)
const COOKIE_NAME = 'app_session';

// Define protected routes that require authentication
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, though we might protect some later)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, assuming it's public)
     * - /login (public login page)
     * - /signup (public signup page)
     * Add any other specific public paths here
     */
    '/((?!api/auth/login|_next/static|_next/image|favicon.ico|login$|signup$|$).*)', // Exclude login API, public pages, root, and static assets
    // Add specific protected routes/patterns here
    '/dashboard/:path*', // Protect dashboard and its sub-routes
    '/admin/:path*',     // Protect admin and its sub-routes
    '/constituent/:path*', // Protect constituent and its sub-routes
    '/test-convex',     // Protect the test page
    // Add other protected routes as needed, e.g., '/settings'
  ],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log(`Middleware running for: ${pathname}`);

  // --- Get Session Cookie --- 
  const sessionCookie = request.cookies.get(COOKIE_NAME);
  const sessionId = sessionCookie?.value;

  console.log(`Middleware: Session ID from cookie (${COOKIE_NAME}): ${sessionId ? 'Present' : 'Missing'}`);

  let isAuthenticated = false;

  // --- Validate Session ID --- 
  if (sessionId) {
    try {
      // Call the Convex HTTP action to validate the session
      // IMPORTANT: Construct the FULL URL to your Convex deployment's HTTP endpoint
      const validationUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site')}/validateSession`;
      console.log(`Middleware: Calling Convex validation endpoint: ${validationUrl}`);
      
      const response = await fetch(validationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        // IMPORTANT: Caching can interfere with auth checks. Disable caching.
        cache: 'no-store',
      });

      console.log(`Middleware: Convex validation response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        isAuthenticated = result.isValid;
        console.log(`Middleware: Convex validation result: ${JSON.stringify(result)} -> isAuthenticated: ${isAuthenticated}`);
      } else {
        console.error(`Middleware: Convex validation failed with status: ${response.status}`);
        isAuthenticated = false; // Treat failed validation as not authenticated
      }
    } catch (error) {
      console.error('Middleware: Error calling Convex validation endpoint:', error);
      isAuthenticated = false; // Treat errors as not authenticated
    }
  }

  // --- Redirect Logic --- 
  // If not authenticated and trying to access a protected route (middleware already filtered by matcher)
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Keep track of intended destination
    console.log(`Middleware: Redirecting unauthenticated user to: ${loginUrl.toString()}`);
    return NextResponse.redirect(loginUrl);
  }
  
  // --- Allow Access --- 
  // If authenticated, allow the request to proceed to the requested page
  console.log(`Middleware: User is authenticated. Allowing request to proceed to: ${pathname}`);
  return NextResponse.next();
}
