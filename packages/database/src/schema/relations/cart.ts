import { relations } from 'drizzle-orm';
import { carts } from '../tables/carts';
import { cartItems } from '../tables/cart_items';
import { cartSessions } from '../tables/cart_sessions';
import { users } from '../tables/users';
import { productVariants } from '../tables/product_variants';

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));
