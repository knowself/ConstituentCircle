
import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  // Add configuration options here if needed
  publicRoutes: ['/']
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
