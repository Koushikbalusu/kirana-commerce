import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { orders } from './orders';

export const orderItems = pgTable(
  'order_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    variantId: text('variant_id').notNull(), // No foreign key constraint strictly needed since it's a snapshot, but it could be. We'll leave it without FK to be perfectly immutable against catalog deletes.
    productName: text('product_name').notNull(),
    sku: text('sku').notNull(),
    quantity: integer('quantity').notNull(),

    // Financial snapshots (Money stored as cents)
    unitPrice: integer('unit_price').notNull(),
    discountAmount: integer('discount_amount').notNull(),
    taxAmount: integer('tax_amount').notNull(),
    totalPrice: integer('total_price').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    orderIdIdx: index('order_item_order_id_idx').on(t.orderId),
  }),
);
