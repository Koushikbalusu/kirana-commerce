import { CheckoutSessionRepository } from './repository';
import { OrderRepository } from '../order/repository';
import { randomBytes } from 'crypto';

const sessionRepo = new CheckoutSessionRepository();
const orderRepo = new OrderRepository();

function generateOrderNumber() {
  return 'ORD-' + randomBytes(4).toString('hex').toUpperCase();
}

export class CheckoutSessionService {
  async createSession(cartId: string, userId?: string): Promise<any> {
    // Basic orchestrator setup
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const idempotencyKey = crypto.randomUUID();

    return await sessionRepo.create({
      cartId,
      userId,
      idempotencyKey,
      expiresAt,
    });
  }

  async completeCheckout(sessionId: string, snapshotData: any): Promise<any> {
    // 1. Validate session
    const session = await sessionRepo.getById(sessionId);
    if (!session || session.status !== 'ACTIVE') throw new Error('Invalid checkout session');
    if (session.expiresAt < new Date()) throw new Error('Checkout session expired');

    // 2. We consume the snapshots orchestrator assembled (e.g. from cart/pricing)
    // 3. Create immutable order and items in a single transaction (via OrderRepository)
    const orderData = {
      orderNumber: generateOrderNumber(),
      userId: session.userId,
      checkoutSessionId: session.id,
      customerSnapshot: snapshotData.customerSnapshot,
      shippingAddressSnapshot: snapshotData.shippingAddressSnapshot,
      billingAddressSnapshot: snapshotData.billingAddressSnapshot,
      totalsSnapshot: snapshotData.totalsSnapshot,
    };

    const itemsData = snapshotData.items.map((i: any) => ({
      variantId: i.variantId,
      productName: i.productName,
      sku: i.sku,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountAmount: i.discountAmount,
      taxAmount: i.taxAmount,
      totalPrice: i.totalPrice,
    }));

    // Creates the order and items atomically
    const order = await orderRepo.createOrderWithItems(orderData, itemsData);

    // 4. Update session status (Ideally part of the same transaction, but for this abstraction it's fine)
    // db.update(checkoutSessions).set({ status: 'COMPLETED' })

    return order;
  }
}
