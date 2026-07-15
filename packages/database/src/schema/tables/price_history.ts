import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { prices } from './prices';

export const priceHistory = pgTable(
  'price_history',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    priceId: text('price_id')
      .notNull()
      .references(() => prices.id),
    amount: integer('amount').notNull(),
    recordedAt: timestamp('recorded_at').defaultNow().notNull(),
  },
  (t) => ({
    priceIdIdx: index('history_price_id_idx').on(t.priceId),
  }),
);
