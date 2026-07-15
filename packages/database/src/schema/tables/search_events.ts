import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';

export const searchEvents = pgTable(
  'search_events',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    sessionId: text('session_id').notNull(),
    eventType: text('event_type').notNull(), // e.g. SEARCH, CLICK, ADD_TO_CART
    term: text('term'),
    documentId: text('document_id'),
    timestamp: timestamp('timestamp').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    sessionIdx: index('search_event_session_idx').on(t.sessionId),
    eventTypeIdx: index('search_event_type_idx').on(t.eventType),
  }),
);
