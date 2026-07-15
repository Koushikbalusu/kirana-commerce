export interface CartEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type CartCreated = CartEvent<{ cartId: string; userId?: string; sessionId?: string }>;
export type CartMerged = CartEvent<{ sourceCartId: string; destinationCartId: string }>;
export type ItemAdded = CartEvent<{ cartId: string; variantId: string; quantity: number }>;
export type ItemRemoved = CartEvent<{ cartId: string; variantId: string }>;
export type QuantityUpdated = CartEvent<{ cartId: string; variantId: string; quantity: number }>;
export type CartCleared = CartEvent<{ cartId: string }>;
export type CouponApplied = CartEvent<{ cartId: string; couponCode: string }>;
export type CouponRemoved = CartEvent<{ cartId: string }>;
export type CartExpired = CartEvent<{ cartId: string }>;
