import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { productVariants } from './product_variants';
import { currencies } from './currencies';

export const prices = pgTable(
  'prices',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    currencyId: text('currency_id')
      .notNull()
      .references(() => currencies.id),
    amount: integer('amount').notNull(), // Smallest currency unit (cents)
    msrp: integer('msrp'),
    startsAt: timestamp('starts_at').defaultNow().notNull(),
    endsAt: timestamp('ends_at'), // Null means forever
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    variantTimeIdx: index('variant_time_idx').on(t.variantId, t.startsAt, t.endsAt),
  }),
);
