import { pgTable, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { notifications } from './notifications';

export const deliveryAttempts = pgTable(
  'delivery_attempts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    notificationId: text('notification_id')
      .notNull()
      .references(() => notifications.id, { onDelete: 'cascade' }),
    providerId: text('provider_id'),
    status: text('status').notNull(), // PENDING, SENT, DELIVERED, FAILED
    providerReferenceId: text('provider_reference_id'),
    errorDetails: jsonb('error_details'),
    attemptNumber: text('attempt_number').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    notifIdx: index('del_attempt_notif_idx').on(t.notificationId),
  }),
);
