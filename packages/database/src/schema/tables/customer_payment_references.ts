import { pgTable, text, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerPaymentReferences = pgTable(
  'customer_payment_references',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    token: text('token').notNull(),
    last4: text('last4'),
    expMonth: text('exp_month'),
    expYear: text('exp_year'),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userPayRefIdx: index('cust_payref_idx').on(t.userId),
  }),
);
