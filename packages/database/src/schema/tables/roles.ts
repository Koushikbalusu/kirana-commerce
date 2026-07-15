import { pgTable, text, boolean } from 'drizzle-orm/pg-core';

export const roles = pgTable('roles', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  isSystem: boolean('is_system').default(false).notNull(),
});
