export interface RefundEntity {
  id: string;
  paymentId: string;
  providerRefundId: string | null;
  amount: number;
  currency: string;
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED';
  providerMetadata: any;
  createdAt: Date;
  updatedAt: Date;
}
