import { db, prices, priceHistory } from '@kirana/database';
import { and, eq, lte, isNull, or, gte } from 'drizzle-orm';
import type { PriceEntity } from './entity';

export class PriceRepository {
  async getActivePriceForVariant(variantId: string): Promise<PriceEntity | null> {
    const now = new Date();
    const [row] = await db
      .select()
      .from(prices)
      .where(
        and(
          eq(prices.variantId, variantId),
          lte(prices.startsAt, now),
          or(isNull(prices.endsAt), gte(prices.endsAt, now)),
        ),
      )
      .limit(1);

    return (row as PriceEntity) || null;
  }

  async create(data: Omit<PriceEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PriceEntity> {
    const result = await db.transaction(async (tx) => {
      const [row] = await tx.insert(prices).values(data).returning();

      // Append-only Immutable History
      await tx.insert(priceHistory).values({
        priceId: row.id,
        amount: row.amount,
      });

      return row;
    });

    return result as PriceEntity;
  }
}
