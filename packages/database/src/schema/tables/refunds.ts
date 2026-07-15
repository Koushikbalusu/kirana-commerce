import { pgTable, text, timestamp, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { payments } from './payments';
import { refundStatusEnum } from '../enums/payments';

export const refunds = pgTable(
  'refunds',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    paymentId: text('payment_id')
      .notNull()
      .references(() => payments.id),
    providerRefundId: text('provider_refund_id'),
    amount: integer('amount').notNull(),
    currency: text('currency').notNull(),
    status: refundStatusEnum('status').default('PENDING').notNull(),
    providerMetadata: jsonb('provider_metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    paymentIdx: index('refund_payment_idx').on(t.paymentId),
  }),
);
