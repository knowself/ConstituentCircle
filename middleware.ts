
import { createMiddleware } from "@clerk/nextjs/server";

export default createMiddleware({
  publicRoutes: ["/", "/blog", "/contact", "/services", "/faq"]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
