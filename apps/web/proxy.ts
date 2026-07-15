export { AuthGuard as proxy } from '@kirana/auth';

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets, api routes, and Next.js internals
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
