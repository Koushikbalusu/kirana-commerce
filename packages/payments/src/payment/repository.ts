import { db, payments } from '@kirana/database';
import { eq } from 'drizzle-orm';
import type { PaymentEntity } from './entity';

export class PaymentRepository {
  async getById(id: string): Promise<PaymentEntity | null> {
    const row = await db.query.payments.findFirst({ where: eq(payments.id, id) });
    return (row as PaymentEntity) || null;
  }
}
