import { pgTable, text, timestamp, index } from 'drizzle-orm/pg-core';
import { customerWishlists } from './customer_wishlists';

export const customerWishlistItems = pgTable(
  'customer_wishlist_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    wishlistId: text('wishlist_id')
      .notNull()
      .references(() => customerWishlists.id, { onDelete: 'cascade' }),
    productId: text('product_id').notNull(),
    addedAt: timestamp('added_at').defaultNow().notNull(),
  },
  (t) => ({
    wishlistProdIdx: index('wishlist_item_idx').on(t.wishlistId, t.productId),
  }),
);
