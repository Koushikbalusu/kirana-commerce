import { pgTable, text, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { users } from './users';
import { cartStatusEnum } from '../enums/cart';

export const carts = pgTable(
  'carts',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    sessionId: text('session_id'), // For guest carts
    status: cartStatusEnum('status').default('ACTIVE').notNull(),
    couponCode: text('coupon_code'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userStatusIdx: index('cart_user_status_idx').on(t.userId, t.status),
    sessionStatusIdx: index('cart_session_status_idx').on(t.sessionId, t.status),
    // Prevent duplicate ACTIVE carts for the same user
    unqActiveUser: unique('unq_active_user_cart').on(t.userId, t.status).nullsNotDistinct(),
  }),
);
