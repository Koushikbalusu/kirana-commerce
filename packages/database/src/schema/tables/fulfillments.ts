import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { orders } from './orders';
import { fulfillmentStatusEnum } from '../enums/orders';

export const fulfillments = pgTable(
  'fulfillments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    trackingNumber: text('tracking_number'),
    carrier: text('carrier'),
    status: fulfillmentStatusEnum('status').default('UNFULFILLED').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    orderIdIdx: index('fulfillment_order_id_idx').on(t.orderId),
  }),
);
