import NextAuth from 'next-auth';
import { adapter } from '../adapters';
import { env } from '@kirana/config';

import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from '../validators';
import { verifyPassword } from '../utils/hash';
import { db, users } from '@kirana/database';
import { eq } from 'drizzle-orm';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: {
    strategy: 'jwt',
  },
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { email, password } = await loginSchema.parseAsync(credentials);

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user || !user.passwordHash) return null;

        const isValid = await verifyPassword(user.passwordHash, password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Idiomatic Auth.js: embed user identity into the stateless token on sign in
      if (user) {
        token.id = user.id;
        // token.role = user.role; // RBAC roles can be embedded here natively
      }
      return token;
    },
    async session({ session, token }) {
      // Hydrate the session object from the stateless token
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
