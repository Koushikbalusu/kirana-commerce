import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const fulfillments = pgTable(
  'fulfillments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    warehouseId: text('warehouse_id').notNull().default('default_warehouse'),
    status: text('status').default('UNFULFILLED').notNull(), // e.g. UNFULFILLED, PROCESSING, FULFILLED
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    orderIdIdx: index('fulfillment_order_id_idx').on(t.orderId),
  }),
);
