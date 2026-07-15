import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { notificationTemplates } from './notification_templates';

export const templateVersions = pgTable(
  'template_versions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    templateId: text('template_id')
      .notNull()
      .references(() => notificationTemplates.id, { onDelete: 'cascade' }),
    version: text('version').notNull(),
    locale: text('locale').default('en').notNull(),
    subject: text('subject'),
    body: text('body').notNull(),
    isActive: boolean('is_active').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    templateIdx: index('tpl_ver_template_idx').on(t.templateId),
  }),
);
