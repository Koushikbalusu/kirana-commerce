import { relations } from 'drizzle-orm';
import { productVariants } from '../tables/product_variants';
import { currencies } from '../tables/currencies';
import { prices } from '../tables/prices';
import { priceHistory } from '../tables/price_history';
import { promotions } from '../tables/promotions';
import { promotionConditions } from '../tables/promotion_conditions';
import { promotionActions } from '../tables/promotion_actions';

export const currencyRelations = relations(currencies, ({ many }) => ({
  prices: many(prices),
}));

export const priceRelations = relations(prices, ({ one, many }) => ({
  variant: one(productVariants, {
    fields: [prices.variantId],
    references: [productVariants.id],
  }),
  currency: one(currencies, {
    fields: [prices.currencyId],
    references: [currencies.id],
  }),
  history: many(priceHistory),
}));

export const priceHistoryRelations = relations(priceHistory, ({ one }) => ({
  price: one(prices, {
    fields: [priceHistory.priceId],
    references: [prices.id],
  }),
}));

export const promotionRelations = relations(promotions, ({ many }) => ({
  conditions: many(promotionConditions),
  actions: many(promotionActions),
}));

export const promotionConditionRelations = relations(promotionConditions, ({ one }) => ({
  promotion: one(promotions, {
    fields: [promotionConditions.promotionId],
    references: [promotions.id],
  }),
}));

export const promotionActionRelations = relations(promotionActions, ({ one }) => ({
  promotion: one(promotions, {
    fields: [promotionActions.promotionId],
    references: [promotions.id],
  }),
}));
