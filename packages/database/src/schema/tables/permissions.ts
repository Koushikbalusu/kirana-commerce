import { pgTable, text } from 'drizzle-orm/pg-core';

export const permissions = pgTable('permissions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  action: text('action').notNull(), // e.g. 'create'
  resource: text('resource').notNull(), // e.g. 'product'
});
