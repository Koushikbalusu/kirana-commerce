import type { Money } from '../money';
import type { PriceEntity } from '../../price/entity';
import type { PromotionEntity } from '../../promotion/entity';
import type { CouponEntity } from '../../coupon/entity';
import type { TaxCategoryEntity } from '../../tax/entity';

export interface PriceResolutionContext {
  basePrice: PriceEntity;
  activePromotions: PromotionEntity[];
  coupon?: CouponEntity;
  taxCategory?: TaxCategoryEntity;
}

export function resolveFinalPrice(context: PriceResolutionContext): Money {
  // 1. Base / Scheduled Price
  let currentAmount = context.basePrice.amount;

  // 2. Promotion (Simplified condition pass assuming pre-filtered)
  let promoDiscount = 0;
  // Apply highest priority promotion (prevent stacking simplifier)
  if (context.activePromotions.length > 0) {
    const promo = context.activePromotions.sort((a, b) => b.priority - a.priority)[0];
    const action = promo.actions?.[0]; // Assume single action for architectural demo
    if (action) {
      if (action.discountType === 'PERCENTAGE') {
        promoDiscount = Math.floor(currentAmount * (action.discountValue / 10000)); // Assuming 10000 = 100.00%
      } else {
        promoDiscount = action.discountValue;
      }
    }
  }

  // 3. Coupon
  let couponDiscount = 0;
  if (context.coupon && (context.coupon.canStack || promoDiscount === 0)) {
    if (context.coupon.discountType === 'PERCENTAGE') {
      couponDiscount = Math.floor(currentAmount * (context.coupon.discountValue / 10000));
    } else {
      couponDiscount = context.coupon.discountValue;
    }
  }

  // Apply total discount
  currentAmount -=
    context.coupon && !context.coupon.canStack && couponDiscount > promoDiscount
      ? couponDiscount
      : promoDiscount + couponDiscount;

  // 5. Floor Safeguard
  if (currentAmount < 0) currentAmount = 0;

  // 4. Tax
  let taxAmount = 0;
  if (context.taxCategory) {
    taxAmount = Math.floor(currentAmount * (context.taxCategory.ratePercentage / 10000));
  }

  currentAmount += taxAmount;

  return {
    amount: currentAmount,
    currencyCode: 'USD', // Example
    precision: 2,
  };
}
