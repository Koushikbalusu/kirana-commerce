import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { users } from './users';

export const customerWishlists = pgTable(
  'customer_wishlists',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    visibility: text('visibility').default('PRIVATE').notNull(), // PRIVATE, SHARED, COLLABORATIVE, FAVORITES, SAVE_FOR_LATER
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    userWishlistIdx: index('cust_wishlist_idx').on(t.userId),
  }),
);
