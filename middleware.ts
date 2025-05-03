
import { createMiddleware } from "@clerk/nextjs";

export default createMiddleware({
  publicRoutes: ['/'],
  ignoredRoutes: [
    '/((?!api|trpc))(_next.*|.+.[w]+$)',
    '/api/clerk-webhook'
  ]
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
