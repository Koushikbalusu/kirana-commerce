import { pgTable, text, timestamp, date, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerProfiles = pgTable(
  'customer_profiles',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    firstName: text('first_name'),
    lastName: text('last_name'),
    dob: date('dob'),
    gender: text('gender'),
    status: text('status').default('ACTIVE').notNull(), // ACTIVE, SUSPENDED, BLOCKED, DELETED, ARCHIVED
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userStatusIdx: index('cust_prof_status_idx').on(t.userId, t.status),
  }),
);
