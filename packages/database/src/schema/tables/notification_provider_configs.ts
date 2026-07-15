import { pgTable, text, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';
import { notificationProviders } from './notification_providers';

export const notificationProviderConfigs = pgTable('notification_provider_configs', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  providerId: text('provider_id')
    .notNull()
    .references(() => notificationProviders.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').default(false).notNull(),
  isFallback: boolean('is_fallback').default(false).notNull(),
  config: jsonb('config'), // e.g. api keys
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
