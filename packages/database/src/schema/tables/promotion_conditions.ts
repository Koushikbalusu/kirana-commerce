import { pgTable, text, jsonb } from 'drizzle-orm/pg-core';
import { promotions } from './promotions';
import { promotionConditionTypeEnum } from '../enums/pricing';

export const promotionConditions = pgTable('promotion_conditions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  promotionId: text('promotion_id')
    .notNull()
    .references(() => promotions.id, { onDelete: 'cascade' }),
  type: promotionConditionTypeEnum('type').notNull(),
  parameters: jsonb('parameters').notNull(), // Flexible constraints matrix
});
