export interface OrderItemEntity {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
  createdAt: Date;
}
