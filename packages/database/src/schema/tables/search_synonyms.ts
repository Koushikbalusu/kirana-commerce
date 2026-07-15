import { pgTable, text, timestamp, jsonb, boolean, index } from 'drizzle-orm/pg-core';

export const searchSynonyms = pgTable(
  'search_synonyms',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    rootTerm: text('root_term').notNull(),
    synonyms: jsonb('synonyms').notNull(), // array of strings
    isBidirectional: boolean('is_bidirectional').default(true).notNull(),
    locale: text('locale').default('en').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    rootTermIdx: index('search_syn_root_term_idx').on(t.rootTerm),
  }),
);
