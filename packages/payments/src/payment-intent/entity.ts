export interface PaymentIntentEntity {
  id: string;
  amount: number;
  currency: string;
  status: 'REQUIRES_PAYMENT_METHOD' | 'REQUIRES_ACTION' | 'PROCESSING' | 'SUCCEEDED' | 'CANCELED';
  captureStrategy: 'AUTOMATIC' | 'MANUAL';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
