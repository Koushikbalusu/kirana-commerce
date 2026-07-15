import { pgTable, text, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { shipments } from './shipments';

export const shipmentItems = pgTable(
  'shipment_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    shipmentId: text('shipment_id')
      .notNull()
      .references(() => shipments.id),
    orderItemId: text('order_item_id').notNull(),
    sku: text('sku').notNull(),
    productName: text('product_name').notNull(),
    variantName: text('variant_name').notNull(),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    shipmentIdx: index('shipment_item_shipment_idx').on(t.shipmentId),
  }),
);
