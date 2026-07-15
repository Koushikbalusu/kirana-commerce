import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { carriers } from './carriers';

export const carrierWebhooks = pgTable(
  'carrier_webhooks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    carrierId: text('carrier_id')
      .notNull()
      .references(() => carriers.id),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status').default('RECEIVED').notNull(),
    processedAt: timestamp('processed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    carrierIdx: index('carrier_webhook_carrier_idx').on(t.carrierId),
  }),
);
