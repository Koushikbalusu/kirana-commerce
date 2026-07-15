import { pgEnum } from 'drizzle-orm/pg-core';

export const discountTypeEnum = pgEnum('discount_type', ['PERCENTAGE', 'FIXED_AMOUNT']);

export const promotionConditionTypeEnum = pgEnum('promotion_condition_type', [
  'MIN_CART_VALUE',
  'INCLUDES_CATEGORY',
  'INCLUDES_BRAND',
  'USER_ROLE',
]);

export const promotionActionTypeEnum = pgEnum('promotion_action_type', [
  'ORDER_DISCOUNT',
  'ITEM_DISCOUNT',
  'FREE_SHIPPING',
]);
