import { db, warehouses } from '@kirana/database';
import type { WarehouseEntity } from './entity';

export class WarehouseRepository {
  async create(
    data: Omit<WarehouseEntity, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>,
  ): Promise<WarehouseEntity> {
    const [row] = await db.insert(warehouses).values(data).returning();
    return row as WarehouseEntity;
  }
}
