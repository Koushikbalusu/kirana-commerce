export interface ShipmentEntity {
  id: string;
  fulfillmentId: string;
  status:
    | 'CREATED'
    | 'PACKED'
    | 'READY_FOR_PICKUP'
    | 'IN_TRANSIT'
    | 'OUT_FOR_DELIVERY'
    | 'DELIVERED'
    | 'RETURNED';
  shippingAddressSnapshot: any;
  customerNameSnapshot: string;
  customerPhoneSnapshot: string;
  createdAt: Date;
  updatedAt: Date;
}
