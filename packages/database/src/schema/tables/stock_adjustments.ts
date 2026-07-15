import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { inventory } from './inventory';
import { stockAdjustmentCategoryEnum } from '../enums/inventory';

export const stockAdjustments = pgTable('stock_adjustments', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  inventoryId: text('inventory_id')
    .notNull()
    .references(() => inventory.id),
  category: stockAdjustmentCategoryEnum('category').notNull(),
  reason: text('reason').notNull(),
  quantityChange: integer('quantity_change').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
