import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { paymentIntents } from './payment_intents';
import { paymentProviders } from './payment_providers';
import { paymentInternalStatusEnum } from '../enums/payments';

export const paymentAttempts = pgTable(
  'payment_attempts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    intentId: text('intent_id')
      .notNull()
      .references(() => paymentIntents.id),
    providerId: text('provider_id')
      .notNull()
      .references(() => paymentProviders.id),
    idempotencyKey: text('idempotency_key').notNull().unique(),
    status: paymentInternalStatusEnum('status').default('PENDING').notNull(),
    failureCode: text('failure_code'),
    failureReason: text('failure_reason'),
    providerMetadata: jsonb('provider_metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    intentIdx: index('payment_attempt_intent_idx').on(t.intentId),
  }),
);
