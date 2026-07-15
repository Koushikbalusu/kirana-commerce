import { pgTable, text, integer, boolean, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { discountTypeEnum } from '../enums/pricing';

export const coupons = pgTable(
  'coupons',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: text('code').notNull().unique(),
    description: text('description'),
    discountType: discountTypeEnum('discount_type').notNull(),
    discountValue: integer('discount_value').notNull(),
    maxUses: integer('max_uses'),
    currentUses: integer('current_uses').default(0).notNull(),
    eligibilityRules: jsonb('eligibility_rules'), // e.g., ["FIRST_ORDER", "PREMIUM_MEMBER"]
    canStack: boolean('can_stack').default(false).notNull(),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    couponCodeIdx: index('coupon_code_idx').on(t.code),
  }),
);
