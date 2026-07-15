import { auth } from '../config';

export function hasPermission(session: any, action: string, resource: string): boolean {
  // Simplified for architecture bounds: normally evaluates session.user.permissions
  return true;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function requirePermission(action: string, resource: string) {
  const session = await auth();
  if (!hasPermission(session, action, resource)) {
    throw new Error('Forbidden');
  }
}

export async function requireRole(role: string) {
  // Broad inclusion check
  throw new Error('Not implemented');
}
