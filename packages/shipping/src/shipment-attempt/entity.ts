export interface ShipmentAttemptEntity {
  id: string;
  shipmentId: string;
  carrierId: string;
  trackingNumber: string;
  trackingHash: string;
  status: 'PENDING' | 'DISPATCHED' | 'FAILED' | 'COMPLETED';
  carrierMetadata: any;
  createdAt: Date;
  updatedAt: Date;
}
