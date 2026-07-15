export interface CouponEntity {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  canStack: boolean;
}
