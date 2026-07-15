import { pgTable, text, timestamp, integer, date, index } from 'drizzle-orm/pg-core';

export const searchAnalytics = pgTable(
  'search_analytics',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    term: text('term').notNull(),
    queryCount: integer('query_count').default(0).notNull(),
    clickCount: integer('click_count').default(0).notNull(),
    zeroResultCount: integer('zero_result_count').default(0).notNull(),
    recordedDate: date('recorded_date').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    termDateIdx: index('search_analytics_term_date_idx').on(t.term, t.recordedDate),
  }),
);
