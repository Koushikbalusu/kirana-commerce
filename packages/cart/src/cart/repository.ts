import { db, carts, cartItems } from '@kirana/database';
import { and, eq, or } from 'drizzle-orm';
import type { CartEntity } from './entity';

export class CartRepository {
  async getActiveCart(userId?: string, sessionId?: string): Promise<CartEntity | null> {
    if (!userId && !sessionId) return null;

    const conditions = [];
    if (userId) conditions.push(eq(carts.userId, userId));
    if (sessionId) conditions.push(eq(carts.sessionId, sessionId));

    const row = await db.query.carts.findFirst({
      where: and(or(...conditions), eq(carts.status, 'ACTIVE')),
      with: {
        items: true,
      },
    });

    return (row as CartEntity) || null;
  }

  async create(data: { userId?: string; sessionId?: string }): Promise<CartEntity> {
    const [row] = await db
      .insert(carts)
      .values({
        userId: data.userId || null,
        sessionId: data.sessionId || null,
        status: 'ACTIVE',
      })
      .returning();

    return { ...row, items: [] } as CartEntity;
  }

  async deleteItem(cartId: string, variantId: string) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)));
  }

  async clearCart(cartId: string) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }

  async setCoupon(cartId: string, couponCode: string | null) {
    await db.update(carts).set({ couponCode, updatedAt: new Date() }).where(eq(carts.id, cartId));
  }
}
