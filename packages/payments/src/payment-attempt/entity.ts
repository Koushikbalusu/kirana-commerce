export interface PaymentAttemptEntity {
  id: string;
  intentId: string;
  providerId: string;
  idempotencyKey: string;
  status: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED';
  failureCode: string | null;
  failureReason: string | null;
  providerMetadata: any;
  createdAt: Date;
  updatedAt: Date;
}
