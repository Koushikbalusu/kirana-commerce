import { relations } from 'drizzle-orm';
import { notifications } from '../tables/notifications';
import { deliveryAttempts } from '../tables/delivery_attempts';

export const notificationRelations = relations(notifications, ({ many }) => ({
  attempts: many(deliveryAttempts),
}));

export const deliveryAttemptRelations = relations(deliveryAttempts, ({ one }) => ({
  notification: one(notifications, {
    fields: [deliveryAttempts.notificationId],
    references: [notifications.id],
  }),
}));
