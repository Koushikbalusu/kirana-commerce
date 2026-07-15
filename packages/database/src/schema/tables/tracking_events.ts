import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { shipmentAttempts } from './shipment_attempts';
import { shipmentStatusEnum } from '../enums/shipping';

export const trackingEvents = pgTable(
  'tracking_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    attemptId: text('attempt_id')
      .notNull()
      .references(() => shipmentAttempts.id),
    internalStatus: shipmentStatusEnum('internal_status').notNull(),
    location: text('location'),
    description: text('description'),
    timestamp: timestamp('timestamp').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    attemptIdx: index('tracking_event_attempt_idx').on(t.attemptId),
  }),
);
