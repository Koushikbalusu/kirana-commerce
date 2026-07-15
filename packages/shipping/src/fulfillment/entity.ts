export interface FulfillmentEntity {
  id: string;
  orderId: string;
  warehouseId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
