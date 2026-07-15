import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { paymentProviders } from './payment_providers';
import { webhookStatusEnum } from '../enums/payments';

export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    providerId: text('provider_id')
      .notNull()
      .references(() => paymentProviders.id),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: webhookStatusEnum('status').default('RECEIVED').notNull(),
    processedAt: timestamp('processed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    providerIdx: index('webhook_provider_idx').on(t.providerId),
    statusIdx: index('webhook_status_idx').on(t.status),
  }),
);
