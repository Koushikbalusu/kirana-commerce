import { pgTable, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { paymentAttempts } from './payment_attempts';
import { paymentInternalStatusEnum } from '../enums/payments';

export const payments = pgTable(
  'payments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    attemptId: text('attempt_id')
      .notNull()
      .unique()
      .references(() => paymentAttempts.id),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    currencyPrecision: integer('currency_precision').notNull(),
    internalStatus: paymentInternalStatusEnum('internal_status').notNull(),
    providerMetadata: jsonb('provider_metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    attemptIdx: index('payment_attempt_id_idx').on(t.attemptId),
  }),
);
