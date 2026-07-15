import { pgTable, text, timestamp, boolean, index, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const inAppNotifications = pgTable(
  'in_app_notifications',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    message: text('message').notNull(),
    priority: text('priority').default('NORMAL').notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    isArchived: boolean('is_archived').default(false).notNull(),
    isPinned: boolean('is_pinned').default(false).notNull(),
    readAt: timestamp('read_at'),
    expiresAt: timestamp('expires_at'),
    deepLink: text('deep_link'),
    actionButtons: jsonb('action_buttons'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userReadIdx: index('in_app_user_read_idx').on(t.userId, t.isRead),
  }),
);
