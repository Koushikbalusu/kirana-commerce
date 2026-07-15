import { relations } from 'drizzle-orm';
import { checkoutSessions } from '../tables/checkout_sessions';
import { orders } from '../tables/orders';
import { orderItems } from '../tables/order_items';
import { orderStatusHistory } from '../tables/order_status_history';
import { fulfillments } from '../tables/fulfillments';

export const orderRelations = relations(orders, ({ one, many }) => ({
  checkoutSession: one(checkoutSessions, {
    fields: [orders.checkoutSessionId],
    references: [checkoutSessions.id],
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  fulfillments: many(fulfillments),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));
