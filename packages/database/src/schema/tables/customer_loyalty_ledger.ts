import { pgTable, text, timestamp, index, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerLoyaltyLedger = pgTable(
  'customer_loyalty_ledger',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    transactionType: text('transaction_type').notNull(), // EARNED, REDEEMED, EXPIRED, ADJUSTED
    points: integer('points').notNull(), // can be negative
    ruleId: text('rule_id'),
    tierId: text('tier_id'),
    expiryDate: timestamp('expiry_date'),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => ({
    userLoyaltyIdx: index('cust_loyalty_idx').on(t.userId),
  }),
);
