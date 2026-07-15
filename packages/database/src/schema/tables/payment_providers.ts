import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const paymentProviders = pgTable('payment_providers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: text('code').notNull().unique(), // e.g. STRIPE, RAZORPAY
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
