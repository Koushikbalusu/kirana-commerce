import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { shipmentAttempts } from './shipment_attempts';

export const shipmentExceptions = pgTable(
  'shipment_exceptions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    attemptId: text('attempt_id')
      .notNull()
      .references(() => shipmentAttempts.id),
    exceptionType: text('exception_type').notNull(), // e.g., Address Invalid, Package Damaged, Lost
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    attemptIdx: index('shipment_exception_attempt_idx').on(t.attemptId),
  }),
);
