export interface CheckoutSessionEntity {
  id: string;
  idempotencyKey: string;
  cartId: string;
  userId: string | null;
  status: 'ACTIVE' | 'PAYMENT_PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED';
  paymentIntentId: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
