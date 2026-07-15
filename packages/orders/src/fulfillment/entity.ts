export interface FulfillmentEntity {
  id: string;
  orderId: string;
  trackingNumber: string | null;
  carrier: string | null;
  status: 'UNFULFILLED' | 'PROCESSING' | 'PARTIALLY_SHIPPED' | 'SHIPPED' | 'DELIVERED';
  createdAt: Date;
  updatedAt: Date;
}
