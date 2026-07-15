import { db, categories } from '@kirana/database';
import { eq } from 'drizzle-orm';
import type { CategoryEntity } from './entity';

export class CategoryRepository {
  async create(
    data: Omit<CategoryEntity, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<CategoryEntity> {
    const [row] = await db.insert(categories).values(data).returning();
    return row as CategoryEntity;
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const [row] = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
    return (row as CategoryEntity) || null;
  }
}
