import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerNotes = pgTable(
  'customer_notes',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    authorId: text('author_id').notNull(),
    noteType: text('note_type').notNull(), // CSR, INTERNAL, PINNED
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    userNotesIdx: index('cust_notes_idx').on(t.userId),
  }),
);
