export interface PaymentEntity {
  id: string;
  attemptId: string;
  amount: number;
  currency: string;
  currencyPrecision: number;
  internalStatus: 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED';
  providerMetadata: any;
  createdAt: Date;
}
