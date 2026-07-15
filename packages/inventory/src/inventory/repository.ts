import { db, inventory } from '@kirana/database';
import { eq, and, asc } from 'drizzle-orm';
import type { InventoryEntity } from './entity';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import * as schema from '@kirana/database/src/schema';

type Tx = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export class InventoryRepository {
  async getOrCreate(tx: Tx, variantId: string, warehouseId: string): Promise<InventoryEntity> {
    const existing = await this.findByVariantAndWarehouseForUpdate(tx, variantId, warehouseId);
    if (existing) return existing;

    // Create if not exists. Concurrency here can be handled with ON CONFLICT DO NOTHING / Retry,
    // but simplifying for the example
    const [row] = await tx.insert(inventory).values({ variantId, warehouseId }).returning();
    return row as InventoryEntity;
  }

  async findByVariantAndWarehouseForUpdate(
    tx: Tx,
    variantId: string,
    warehouseId: string,
  ): Promise<InventoryEntity | null> {
    const [row] = await tx
      .select()
      .from(inventory)
      .where(and(eq(inventory.variantId, variantId), eq(inventory.warehouseId, warehouseId)))
      .for('update') // PESSIMISTIC LOCKING
      .limit(1);
    return (row as InventoryEntity) || null;
  }

  async updateQuantities(
    tx: Tx,
    id: string,
    availableDelta: number,
    reservedDelta: number,
  ): Promise<InventoryEntity> {
    const [row] = await tx.select().from(inventory).where(eq(inventory.id, id)).for('update');
    if (!row) throw new Error('Inventory not found');

    const newAvail = row.availableQuantity + availableDelta;
    const newRes = row.reservedQuantity + reservedDelta;

    if (newAvail < 0) throw new Error('Insufficient available stock');
    if (newRes < 0) throw new Error('Reserved stock cannot be negative');

    const [updated] = await tx
      .update(inventory)
      .set({
        availableQuantity: newAvail,
        reservedQuantity: newRes,
        version: row.version + 1,
        updatedAt: new Date(),
      })
      .where(eq(inventory.id, id))
      .returning();

    return updated as InventoryEntity;
  }
}
