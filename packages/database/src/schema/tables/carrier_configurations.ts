import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { carriers } from './carriers';

export const carrierConfigurations = pgTable('carrier_configurations', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  carrierId: text('carrier_id')
    .notNull()
    .references(() => carriers.id),
  environment: text('environment').notNull(), // TEST, LIVE
  isActive: boolean('is_active').default(true).notNull(),
  apiKeysReference: text('api_keys_reference').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
