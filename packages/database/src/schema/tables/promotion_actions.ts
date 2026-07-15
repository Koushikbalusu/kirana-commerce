import { pgTable, text, integer } from 'drizzle-orm/pg-core';
import { promotions } from './promotions';
import { promotionActionTypeEnum, discountTypeEnum } from '../enums/pricing';

export const promotionActions = pgTable('promotion_actions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  promotionId: text('promotion_id')
    .notNull()
    .references(() => promotions.id, { onDelete: 'cascade' }),
  type: promotionActionTypeEnum('type').notNull(),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: integer('discount_value').notNull(), // Percentage mapped to integer or fixed cents
});
