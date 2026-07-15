import { pgTable, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notifications = pgTable(
  'notifications',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    channel: text('channel').notNull(),
    category: text('category').notNull(), // TRANSACTIONAL, MARKETING
    status: text('status').default('PENDING').notNull(), // PENDING, SCHEDULED, PROCESSING, DELIVERED, FAILED, CANCELED
    subject: text('subject'),
    body: text('body').notNull(),
    templateVersionId: text('template_version_id'),
    metadata: jsonb('metadata'),
    scheduledFor: timestamp('scheduled_for'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userStatusIdx: index('notif_user_status_idx').on(t.userId, t.status),
  }),
);
