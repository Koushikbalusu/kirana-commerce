import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { inventory } from './inventory';
import { inventoryMovementTypeEnum } from '../enums/inventory';

export const inventoryMovements = pgTable(
  'inventory_movements',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    inventoryId: text('inventory_id')
      .notNull()
      .references(() => inventory.id),
    type: inventoryMovementTypeEnum('type').notNull(),
    quantity: integer('quantity').notNull(),
    referenceId: text('reference_id'), // Can point to Order ID, Transfer ID, etc.
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    inventoryIdIdx: index('movement_inventory_id_idx').on(t.inventoryId),
    createdAtIdx: index('movement_created_at_idx').on(t.createdAt),
  }),
);
