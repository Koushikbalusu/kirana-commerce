import { db, cartItems } from '@kirana/database';

export class CartItemRepository {
  async upsertItem(cartId: string, variantId: string, quantity: number) {
    await db
      .insert(cartItems)
      .values({
        cartId,
        variantId,
        quantity,
      })
      .onConflictDoUpdate({
        target: [cartItems.cartId, cartItems.variantId],
        set: {
          quantity,
          updatedAt: new Date(),
        },
      });
  }
}
