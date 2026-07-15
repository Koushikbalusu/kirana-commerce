import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const orderStatusHistory = pgTable(
  'order_status_history',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // "FINANCIAL" | "FULFILLMENT"
    oldStatus: text('old_status').notNull(),
    newStatus: text('new_status').notNull(),
    reason: text('reason'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    orderIdIdx: index('order_status_history_order_id_idx').on(t.orderId),
  }),
);
