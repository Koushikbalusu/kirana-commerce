import { db, products } from '@kirana/database';
import { eq, and, isNull } from 'drizzle-orm';
import type { ProductEntity } from './entity';

export class ProductRepository {
  async create(
    data: Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<ProductEntity> {
    const [row] = await db.insert(products).values(data).returning();
    return row as ProductEntity;
  }

  async findById(id: string): Promise<ProductEntity | null> {
    const [row] = await db
      .select()
      .from(products)
      .where(and(eq(products.id, id), isNull(products.deletedAt)))
      .limit(1);
    return (row as ProductEntity) || null;
  }

  async updateStatus(id: string, status: ProductEntity['status']): Promise<ProductEntity> {
    const [row] = await db
      .update(products)
      .set({ status, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    if (!row) throw new Error('Product not found');
    return row as ProductEntity;
  }

  async softDelete(id: string): Promise<void> {
    await db
      .update(products)
      .set({ status: 'DELETED', deletedAt: new Date() })
      .where(eq(products.id, id));
  }
}
