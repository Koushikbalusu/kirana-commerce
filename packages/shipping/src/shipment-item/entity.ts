export interface ShipmentItemEntity {
  id: string;
  shipmentId: string;
  orderItemId: string;
  sku: string;
  productName: string;
  variantName: string;
  quantity: number;
  createdAt: Date;
}
