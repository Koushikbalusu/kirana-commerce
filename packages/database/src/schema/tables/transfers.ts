import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses';
import { productVariants } from './product_variants';
import { transferStatusEnum } from '../enums/inventory';

export const transfers = pgTable('transfers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sourceWarehouseId: text('source_warehouse_id')
    .notNull()
    .references(() => warehouses.id),
  destinationWarehouseId: text('destination_warehouse_id')
    .notNull()
    .references(() => warehouses.id),
  variantId: text('variant_id')
    .notNull()
    .references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  status: transferStatusEnum('status').default('PENDING').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
