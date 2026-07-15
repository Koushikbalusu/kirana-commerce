import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { notifications } from './notifications';

export const notificationAnalytics = pgTable(
  'notification_analytics',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    notificationId: text('notification_id')
      .notNull()
      .references(() => notifications.id, { onDelete: 'cascade' }),
    eventType: text('event_type').notNull(), // DELIVERED, OPENED, CLICKED, DISMISSED, UNSUBSCRIBED
    providerLatencyMs: text('provider_latency_ms'),
    retryCount: text('retry_count'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    notifEventIdx: index('notif_analytic_idx').on(t.notificationId, t.eventType),
  }),
);
