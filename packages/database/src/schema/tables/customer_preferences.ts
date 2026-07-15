import { pgTable, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerPreferences = pgTable(
  'customer_preferences',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    language: text('language').default('en').notNull(),
    currency: text('currency').default('USD').notNull(),
    theme: text('theme').default('system').notNull(),
    accessibility: jsonb('accessibility'),
    marketing: jsonb('marketing'),
    shopping: jsonb('shopping'),
    privacy: jsonb('privacy'),
    notifications: jsonb('notifications'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userPrefIdx: index('cust_prefs_idx').on(t.userId),
  }),
);
