import { db, shipments } from '@kirana/database';
import { eq } from 'drizzle-orm';
import type { ShipmentEntity } from './entity';

export class ShipmentRepository {
  async getById(id: string): Promise<ShipmentEntity | null> {
    const row = await db.query.shipments.findFirst({ where: eq(shipments.id, id) });
    return (row as ShipmentEntity) || null;
  }
}
