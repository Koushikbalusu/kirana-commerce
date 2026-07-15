import { db, orders, orderItems, orderStatusHistory } from '@kirana/database';
import { eq } from 'drizzle-orm';
import type { OrderEntity } from './entity';
import type { OrderItemEntity } from '../order-item/entity';

export class OrderRepository {
  async getById(orderId: string): Promise<OrderEntity | null> {
    const row = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: true,
      },
    });
    return (row as OrderEntity) || null;
  }

  async createOrderWithItems(orderData: any, itemsData: any[]): Promise<OrderEntity> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(orderData).returning();

      const insertedItems = [];
      if (itemsData.length > 0) {
        const toInsert = itemsData.map((item) => ({ ...item, orderId: order.id }));
        const res = await tx.insert(orderItems).values(toInsert).returning();
        insertedItems.push(...res);
      }

      return { ...order, items: insertedItems } as OrderEntity;
    });
  }

  async updateFinancialStatus(orderId: string, status: any, reason?: string) {
    await db.transaction(async (tx) => {
      const row = await tx.query.orders.findFirst({ where: eq(orders.id, orderId) });
      if (!row) return;

      await tx
        .update(orders)
        .set({ financialStatus: status, updatedAt: new Date() })
        .where(eq(orders.id, orderId));
      await tx.insert(orderStatusHistory).values({
        orderId,
        type: 'FINANCIAL',
        oldStatus: row.financialStatus,
        newStatus: status,
        reason: reason || null,
      });
    });
  }
}
