import { pgTable, text, integer, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { carts } from './carts';
import { productVariants } from './product_variants';

export const cartItems = pgTable(
  'cart_items',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    cartId: text('cart_id')
      .notNull()
      .references(() => carts.id, { onDelete: 'cascade' }),
    variantId: text('variant_id')
      .notNull()
      .references(() => productVariants.id),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    cartVariantUnq: unique('unq_cart_variant').on(t.cartId, t.variantId),
    cartIdIdx: index('cart_item_cart_id_idx').on(t.cartId),
  }),
);
