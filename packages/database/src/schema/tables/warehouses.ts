import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { warehouseTypeEnum } from '../enums/inventory';

export const warehouses = pgTable('warehouses', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  locationCode: text('location_code').notNull().unique(),
  type: warehouseTypeEnum('type').default('FULFILLMENT_CENTER').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
