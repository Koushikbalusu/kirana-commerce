import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { paymentProviders } from './payment_providers';

export const providerConfigurations = pgTable('provider_configurations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  providerId: text('provider_id')
    .notNull()
    .references(() => paymentProviders.id),
  environment: text('environment').notNull(), // TEST, LIVE
  isActive: boolean('is_active').default(true).notNull(),
  apiKeysReference: text('api_keys_reference').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
