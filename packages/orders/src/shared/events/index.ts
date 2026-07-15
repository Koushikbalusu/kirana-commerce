export interface OrderEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type OrderCreated = OrderEvent<{ orderId: string; orderNumber: string; userId?: string }>;
export type OrderConfirmed = OrderEvent<{ orderId: string }>;
export type OrderCancelled = OrderEvent<{ orderId: string; reason?: string }>;
export type OrderShipped = OrderEvent<{ orderId: string; trackingNumber?: string }>;
export type OrderDelivered = OrderEvent<{ orderId: string }>;
export type OrderRefunded = OrderEvent<{ orderId: string; amount: number }>;
