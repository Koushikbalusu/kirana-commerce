export interface PricingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type PriceChanged = PricingEvent<{ variantId: string; oldPrice: number; newPrice: number }>;
export type PromotionActivated = PricingEvent<{ promotionId: string }>;
export type PromotionExpired = PricingEvent<{ promotionId: string }>;
export type CouponRedeemed = PricingEvent<{ couponCode: string; orderId: string }>;
export type CouponExpired = PricingEvent<{ couponCode: string }>;
