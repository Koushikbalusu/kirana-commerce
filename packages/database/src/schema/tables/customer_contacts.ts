import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerContacts = pgTable(
  'customer_contacts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // EMAIL, PHONE, SEC_EMAIL, SEC_PHONE, RECOVERY
    value: text('value').notNull(),
    isVerified: boolean('is_verified').default(false).notNull(),
    verificationProvider: text('verification_provider'),
    verificationAttempts: text('verification_attempts'),
    verifiedAt: timestamp('verified_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userTypeIdx: index('cust_contact_idx').on(t.userId, t.type),
  }),
);
