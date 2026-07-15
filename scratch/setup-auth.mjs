import fs from 'fs';
import path from 'path';

const rootDir = '/home/koushik/Documents/kirana-commerce';
const authDir = path.join(rootDir, 'packages/auth');
const srcDir = path.join(authDir, 'src');

const dirs = [
  'adapters',
  'callbacks',
  'config',
  'providers',
  'middleware',
  'permissions',
  'roles',
  'services',
  'utils',
  'validators',
];

dirs.forEach((d) => fs.mkdirSync(path.join(srcDir, d), { recursive: true }));

// package.json
fs.writeFileSync(
  path.join(authDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/auth',
      version: '0.1.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      dependencies: {
        'next-auth': 'beta',
        '@auth/drizzle-adapter': '^1.4.1',
        argon2: '^0.40.3',
        zod: '^3.23.8',
        '@kirana/database': '*',
        '@kirana/config': '*',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
      },
    },
    null,
    2,
  ) + '\n',
);

// tsconfig.json
fs.writeFileSync(
  path.join(authDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
    },
    null,
    2,
  ) + '\n',
);

// utils/hash.ts
fs.writeFileSync(
  path.join(srcDir, 'utils/hash.ts'),
  `
import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password);
}
`.trim() + '\n',
);

// validators/index.ts
fs.writeFileSync(
  path.join(srcDir, 'validators/index.ts'),
  `
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2),
});
`.trim() + '\n',
);

// adapters/index.ts
fs.writeFileSync(
  path.join(srcDir, 'adapters/index.ts'),
  `
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@kirana/database";

export const adapter = DrizzleAdapter(db);
`.trim() + '\n',
);

// config/index.ts
fs.writeFileSync(
  path.join(srcDir, 'config/index.ts'),
  `
import NextAuth from "next-auth";
import { adapter } from "../adapters";
import { env } from "@kirana/config";

// Credentials Provider configuration
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "../validators";
import { verifyPassword } from "../utils/hash";
import { db, schema } from "@kirana/database";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  session: {
    strategy: "database", // DB backed sessions as requested
  },
  secret: env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { email, password } = await loginSchema.parseAsync(credentials);
        
        // Find user by email
        const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email)).limit(1);
        if (!user || !user.passwordHash) return null;
        
        // Verify password
        const isValid = await verifyPassword(user.passwordHash, password);
        if (!isValid) return null;
        
        return user;
      }
    })
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        // In a real implementation, we would query and attach roles/permissions here
        // e.g. session.user.permissions = await fetchPermissions(user.id);
      }
      return session;
    }
  }
});
`.trim() + '\n',
);

// permissions/index.ts
fs.writeFileSync(
  path.join(srcDir, 'permissions/index.ts'),
  `
import { auth } from "../config";

export function hasPermission(session: any, action: string, resource: string): boolean {
  // Simplified for architecture bounds: normally evaluates session.user.permissions
  return true;
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function requirePermission(action: string, resource: string) {
  const session = await auth();
  if (!hasPermission(session, action, resource)) {
    throw new Error("Forbidden");
  }
}

export async function requireRole(role: string) {
  // Broad inclusion check
  throw new Error("Not implemented");
}
`.trim() + '\n',
);

// middleware/index.ts
fs.writeFileSync(
  path.join(srcDir, 'middleware/index.ts'),
  `
import { auth } from "../config";

export const AuthGuard = auth((req) => {
  // Example redirect if unauthorized
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith('/api/auth');
  
  if (!isLoggedIn && !isAuthRoute) {
    // Should redirect to login ideally
  }
});
`.trim() + '\n',
);

// index.ts (Barrel)
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export { auth, signIn, signOut, handlers } from "./config";
export { getCurrentUser, requirePermission, requireRole, hasPermission } from "./permissions";
export { AuthGuard } from "./middleware";
`.trim() + '\n',
);

console.log('Auth package scaffolded.');
