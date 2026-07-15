import { auth } from '../config';

export const AuthGuard = auth((req) => {
  // Example redirect if unauthorized
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');

  if (!isLoggedIn && !isAuthRoute) {
    // Should redirect to login ideally
  }
});
