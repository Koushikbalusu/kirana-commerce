import { pgTable, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerTimeline = pgTable(
  'customer_timeline',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    eventType: text('event_type').notNull(),
    metadata: jsonb('metadata'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
  },
  (t) => ({
    userTimelineIdx: index('cust_timeline_idx').on(t.userId, t.timestamp),
  }),
);
