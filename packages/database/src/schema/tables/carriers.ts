import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const carriers = pgTable('carriers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(), // e.g., DELHIVERY, BLUEDART
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
