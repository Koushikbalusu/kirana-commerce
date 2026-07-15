import { db, inventoryMovements } from '@kirana/database';
import type { MovementEntity } from './entity';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import * as schema from '@kirana/database/src/schema';

type Tx = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export class MovementRepository {
  async recordMovement(
    tx: Tx,
    data: Omit<MovementEntity, 'id' | 'createdAt'>,
  ): Promise<MovementEntity> {
    const [row] = await tx.insert(inventoryMovements).values(data).returning();
    return row as MovementEntity;
  }
}
