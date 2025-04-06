import { clerkMiddleware } from '@clerk/nextjs';

export default clerkMiddleware();

// We can re-introduce route matching later if needed,
// for now let's use Clerk's default protection.
// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)', 
//   '/admin(.*)',    
//   '/constituent(.*)', 
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) {
//     auth().protect(); 
//   }
// });

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
