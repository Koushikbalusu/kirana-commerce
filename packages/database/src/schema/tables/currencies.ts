import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const currencies = pgTable('currencies', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(), // e.g. "USD"
  symbol: text('symbol').notNull(), // e.g. "$"
  precision: integer('precision').default(2).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
