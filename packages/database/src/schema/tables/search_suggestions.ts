import { pgTable, text, timestamp, integer, boolean, index } from 'drizzle-orm/pg-core';

export const searchSuggestions = pgTable(
  'search_suggestions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    term: text('term').notNull().unique(),
    weight: integer('weight').default(0).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    termIdx: index('search_sugg_term_idx').on(t.term),
  }),
);
