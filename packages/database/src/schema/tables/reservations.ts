import { pgTable, text, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { inventory } from './inventory';
import { reservationStatusEnum } from '../enums/inventory';

export const reservations = pgTable(
  'reservations',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    inventoryId: text('inventory_id')
      .notNull()
      .references(() => inventory.id),
    ownerType: text('owner_type').notNull(),
    ownerId: text('owner_id').notNull(),
    quantity: integer('quantity').notNull(),
    status: reservationStatusEnum('status').default('PENDING').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    expiresAtIdx: index('expires_at_idx').on(t.expiresAt),
  }),
);
