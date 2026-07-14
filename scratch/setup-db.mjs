import fs from 'fs';
import path from 'path';

const rootDir = '/home/koushik/Documents/kirana-commerce';
const dbDir = path.join(rootDir, 'packages/database');
const srcDir = path.join(dbDir, 'src');

const dirs = [
  'client',
  'config',
  'schema/tables',
  'schema/relations',
  'schema/enums',
  'migrations',
  'repositories',
  'views',
  'transactions',
  'seeds',
  'utils',
];

dirs.forEach((d) => fs.mkdirSync(path.join(srcDir, d), { recursive: true }));

// package.json
fs.writeFileSync(
  path.join(dbDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/database',
      version: '0.1.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      scripts: {
        'db:generate': 'drizzle-kit generate',
        'db:push': 'drizzle-kit push',
        'db:migrate': 'drizzle-kit migrate',
      },
      dependencies: {
        'drizzle-orm': '^0.30.10',
        '@neondatabase/serverless': '^0.9.0',
        '@kirana/config': '*',
      },
      devDependencies: {
        'drizzle-kit': '^0.20.14',
        dotenv: '^16.4.5',
      },
    },
    null,
    2,
  ) + '\n',
);

// tsconfig.json
fs.writeFileSync(
  path.join(dbDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src', 'drizzle.config.ts'],
    },
    null,
    2,
  ) + '\n',
);

// drizzle.config.ts
fs.writeFileSync(
  path.join(dbDir, 'drizzle.config.ts'),
  `
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./src/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "postgres://user:pass@localhost:5432/kirana",
  },
  verbose: true,
  strict: true,
});
`.trim() + '\n',
);

// client/index.ts
fs.writeFileSync(
  path.join(srcDir, 'client/index.ts'),
  `
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { env } from '@kirana/config';
import * as schema from '../schema';

neonConfig.fetchConnectionCache = true;

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export type Database = typeof db;
`.trim() + '\n',
);

// schema/index.ts
fs.writeFileSync(
  path.join(srcDir, 'schema/index.ts'),
  `
export {};
`.trim() + '\n',
);

const createGitkeep = (subPath) => fs.writeFileSync(path.join(srcDir, subPath, '.gitkeep'), '');
createGitkeep('schema/tables');
createGitkeep('schema/relations');
createGitkeep('schema/enums');
createGitkeep('migrations');
createGitkeep('repositories');
createGitkeep('views');
createGitkeep('seeds');
createGitkeep('utils');

// transactions/index.ts
fs.writeFileSync(
  path.join(srcDir, 'transactions/index.ts'),
  `
import { db } from "../client";

export async function withTransaction<T>(
  callback: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>
): Promise<T> {
  return await db.transaction(async (tx) => {
    return await callback(tx);
  });
}
`.trim() + '\n',
);

// index.ts (Barrel)
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./client";
export * from "./transactions";
export * from "./schema";
`.trim() + '\n',
);

console.log('Database package scaffolded.');
