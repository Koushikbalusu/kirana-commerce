import { db, reservations } from '@kirana/database';
import type { ReservationEntity } from './entity';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonHttpQueryResultHKT } from 'drizzle-orm/neon-http';
import * as schema from '@kirana/database/src/schema';

type Tx = PgTransaction<
  NeonHttpQueryResultHKT,
  typeof schema,
  ExtractTablesWithRelations<typeof schema>
>;

export class ReservationRepository {
  async create(
    tx: Tx,
    data: Omit<ReservationEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): Promise<ReservationEntity> {
    const [row] = await tx.insert(reservations).values(data).returning();
    return row as ReservationEntity;
  }
}
