import { pgTable, text, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { users } from './users';
import { checkoutSessionStatusEnum } from '../enums/orders';

export const checkoutSessions = pgTable(
  'checkout_sessions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    idempotencyKey: text('idempotency_key').notNull().unique(),
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id),
    userId: text('user_id').references(() => users.id), // Can be null for guests, though usually requires auth for final order
    status: checkoutSessionStatusEnum('status').default('ACTIVE').notNull(),
    paymentIntentId: text('payment_intent_id'),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    statusIdx: index('checkout_session_status_idx').on(t.status),
    userIdIdx: index('checkout_session_user_idx').on(t.userId),
  }),
);
