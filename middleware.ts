
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Get user info from Replit Auth
  const userResponse = await fetch('/__replauthuser', {
    headers: { Cookie: request.headers.get('cookie') || '' }
  });
  
  const user = userResponse.ok ? await userResponse.json() : null;
  
  // Protected routes that require authentication
  const protectedPaths = ['/dashboard', '/admin', '/constituent'];
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
