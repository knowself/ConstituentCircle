
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const publicPaths = ['/', '/blog', '/contact', '/services', '/faq'];
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith('/api/')
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  try {
    const response = await fetch(new URL('/__replauthuser', request.url), {
      headers: {
        Cookie: request.headers.get('cookie') || '',
        Host: request.headers.get('host') || '',
      },
    });

    const user = response.ok ? await response.json() : null;

    if (!user && !request.nextUrl.pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
