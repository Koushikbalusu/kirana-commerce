import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const taxCategories = pgTable('tax_categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(), // e.g., "Standard", "Exempt"
  ratePercentage: integer('rate_percentage').notNull(), // Integer representing precision. e.g. 850 = 8.5%
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
