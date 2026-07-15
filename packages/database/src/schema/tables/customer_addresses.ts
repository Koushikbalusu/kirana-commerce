import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerAddresses = pgTable(
  'customer_addresses',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // BILLING, SHIPPING, PICKUP, OFFICE, HOME, TEMPORARY
    isDefaultBilling: boolean('is_default_billing').default(false).notNull(),
    isDefaultShipping: boolean('is_default_shipping').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userTypeIdx: index('cust_addr_user_type_idx').on(t.userId, t.type),
  }),
);
