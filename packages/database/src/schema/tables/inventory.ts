import { pgTable, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';
import { productVariants } from './product_variants';
import { warehouses } from './warehouses';

export const inventory = pgTable(
  'inventory',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    warehouseId: text('warehouse_id')
      .notNull()
      .references(() => warehouses.id),
    availableQuantity: integer('available_quantity').default(0).notNull(),
    reservedQuantity: integer('reserved_quantity').default(0).notNull(),
    version: integer('version').default(1).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.variantId, t.warehouseId),
  }),
);
