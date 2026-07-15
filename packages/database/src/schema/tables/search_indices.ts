import { pgTable, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const searchIndices = pgTable('search_indices', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(), // e.g. "products_v1"
  provider: text('provider').notNull(), // e.g. "POSTGRES", "TYPESENSE"
  settings: jsonb('settings'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
