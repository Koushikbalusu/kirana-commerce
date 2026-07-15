import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const userNotificationPreferences = pgTable(
  'user_notification_preferences',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    channel: text('channel').notNull(),
    category: text('category').notNull(), // TRANSACTIONAL, MARKETING, SECURITY, SYSTEM
    isEnabled: boolean('is_enabled').default(true).notNull(),
    quietHoursStart: text('quiet_hours_start'), // HH:mm
    quietHoursEnd: text('quiet_hours_end'), // HH:mm
    timezone: text('timezone').default('UTC').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userChannelCategoryIdx: index('user_pref_idx').on(t.userId, t.channel, t.category),
  }),
);
