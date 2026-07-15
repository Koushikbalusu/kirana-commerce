import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

export const cartSessions = pgTable(
  'cart_sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    tokenIdx: index('cart_session_token_idx').on(t.token),
  }),
);
