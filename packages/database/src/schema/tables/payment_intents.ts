import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';
import { captureStrategyEnum, paymentIntentStatusEnum } from '../enums/payments';

export const paymentIntents = pgTable('payment_intents', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  status: paymentIntentStatusEnum('status').default('REQUIRES_PAYMENT_METHOD').notNull(),
  captureStrategy: captureStrategyEnum('capture_strategy').default('AUTOMATIC').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
