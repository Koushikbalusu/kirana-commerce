import { pgTable, timestamp, text, varchar, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified', { mode: 'date' }),
  image: text('image'),
  passwordHash: text('password_hash'),
  accountStatus: varchar('account_status', { length: 20 }).default('UNVERIFIED').notNull(),
});
