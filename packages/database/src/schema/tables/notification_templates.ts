import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

export const notificationTemplates = pgTable('notification_templates', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  key: text('key').notNull().unique(), // e.g. "ORDER_CONFIRMATION"
  channel: text('channel').notNull(),
  category: text('category').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
