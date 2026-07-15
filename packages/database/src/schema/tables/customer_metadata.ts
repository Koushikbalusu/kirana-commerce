import { pgTable, text, timestamp, index, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerMetadata = pgTable(
  'customer_metadata',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    tags: jsonb('tags'), // array of strings
    segments: jsonb('segments'), // array of strings
    labels: jsonb('labels'),
    customAttributes: jsonb('custom_attributes'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userMetaIdx: index('cust_meta_idx').on(t.userId),
  }),
);
