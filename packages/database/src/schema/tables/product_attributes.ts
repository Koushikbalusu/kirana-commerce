import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const productAttributes = pgTable('product_attributes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(), // e.g. "Size", "Color"
});
