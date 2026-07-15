import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const notificationWebhooks = pgTable(
  'notification_webhooks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    providerId: text('provider_id').notNull(),
    providerReferenceId: text('provider_reference_id'),
    eventType: text('event_type').notNull(),
    payload: jsonb('payload').notNull(),
    status: text('status').default('RECEIVED').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    refIdx: index('notif_webhook_ref_idx').on(t.providerReferenceId),
  }),
);
