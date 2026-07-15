import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { shipmentAttempts } from './shipment_attempts';
import { shippingLabelFormatEnum } from '../enums/shipping';

export const shippingLabels = pgTable(
  'shipping_labels',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    attemptId: text('attempt_id')
      .notNull()
      .references(() => shipmentAttempts.id),
    format: shippingLabelFormatEnum('format').notNull(),
    url: text('url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    attemptIdx: index('shipping_label_attempt_idx').on(t.attemptId),
  }),
);
