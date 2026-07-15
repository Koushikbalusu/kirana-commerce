import { db, checkoutSessions } from '@kirana/database';
import { eq } from 'drizzle-orm';
import type { CheckoutSessionEntity } from './entity';

export class CheckoutSessionRepository {
  async create(data: {
    idempotencyKey: string;
    cartId: string;
    userId?: string;
    expiresAt: Date;
  }): Promise<CheckoutSessionEntity> {
    const [row] = await db
      .insert(checkoutSessions)
      .values({
        idempotencyKey: data.idempotencyKey,
        cartId: data.cartId,
        userId: data.userId || null,
        expiresAt: data.expiresAt,
      })
      .returning();
    return row as CheckoutSessionEntity;
  }

  async getById(id: string): Promise<CheckoutSessionEntity | null> {
    const row = await db.query.checkoutSessions.findFirst({ where: eq(checkoutSessions.id, id) });
    return (row as CheckoutSessionEntity) || null;
  }
}
