import fs from 'fs';
import path from 'path';

const rootDir = '/home/koushik/Documents/kirana-commerce';
const dbSrc = path.join(rootDir, 'packages/database/src');

// Auth tables based on @auth/drizzle-adapter schema requirements
fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/users.ts'),
  `
import { pgTable, timestamp, text, varchar, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  accountStatus: varchar("account_status", { length: 20 }).default("UNVERIFIED").notNull(),
});
`.trim() + '\n',
);

fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/accounts.ts'),
  `
import { pgTable, text, primaryKey, integer } from "drizzle-orm/pg-core";
import { users } from "./users";
import type { AdapterAccountType } from "next-auth/adapters";

export const accounts = pgTable("accounts", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state")
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] })
}));
`.trim() + '\n',
);

fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/sessions.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull()
});
`.trim() + '\n',
);

fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/verification_tokens.ts'),
  `
import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull()
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] })
}));
`.trim() + '\n',
);

// RBAC Tables
fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/roles.ts'),
  `
import { pgTable, text, boolean } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
  isSystem: boolean("is_system").default(false).notNull(),
});
`.trim() + '\n',
);

fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/permissions.ts'),
  `
import { pgTable, text } from "drizzle-orm/pg-core";

export const permissions = pgTable("permissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  action: text("action").notNull(), // e.g. 'create'
  resource: text("resource").notNull(), // e.g. 'product'
});
`.trim() + '\n',
);

fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/role_permissions.ts'),
  `
import { pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions = pgTable("role_permissions", {
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" })
}, (t) => ({
  pk: primaryKey({ columns: [t.roleId, t.permissionId] })
}));
`.trim() + '\n',
);

fs.writeFileSync(
  path.join(dbSrc, 'schema/tables/user_roles.ts'),
  `
import { pgTable, text, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { roles } from "./roles";

export const userRoles = pgTable("user_roles", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => roles.id, { onDelete: "cascade" })
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] })
}));
`.trim() + '\n',
);

// Export from schema/index.ts
fs.writeFileSync(
  path.join(dbSrc, 'schema/index.ts'),
  `
export * from "./tables/users";
export * from "./tables/accounts";
export * from "./tables/sessions";
export * from "./tables/verification_tokens";
export * from "./tables/roles";
export * from "./tables/permissions";
export * from "./tables/role_permissions";
export * from "./tables/user_roles";
`.trim() + '\n',
);

console.log('Database auth tables created.');
