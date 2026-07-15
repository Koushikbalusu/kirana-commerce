import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { notifications } from './notifications';

export const notificationAttachments = pgTable(
  'notification_attachments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    notificationId: text('notification_id')
      .notNull()
      .references(() => notifications.id, { onDelete: 'cascade' }),
    fileName: text('file_name').notNull(),
    fileType: text('file_type').notNull(), // PDF, CSV, IMAGE
    url: text('url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    notifIdx: index('notif_attach_idx').on(t.notificationId),
  }),
);
