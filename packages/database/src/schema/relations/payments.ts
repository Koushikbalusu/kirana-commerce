import { relations } from 'drizzle-orm';
import { paymentProviders } from '../tables/payment_providers';
import { providerConfigurations } from '../tables/provider_configurations';
import { paymentIntents } from '../tables/payment_intents';
import { paymentAttempts } from '../tables/payment_attempts';
import { payments } from '../tables/payments';
import { refunds } from '../tables/refunds';
import { webhookEvents } from '../tables/webhook_events';

export const paymentProviderRelations = relations(paymentProviders, ({ many }) => ({
  configurations: many(providerConfigurations),
  attempts: many(paymentAttempts),
  webhooks: many(webhookEvents),
}));

export const providerConfigurationRelations = relations(providerConfigurations, ({ one }) => ({
  provider: one(paymentProviders, {
    fields: [providerConfigurations.providerId],
    references: [paymentProviders.id],
  }),
}));

export const paymentIntentRelations = relations(paymentIntents, ({ many }) => ({
  attempts: many(paymentAttempts),
}));

export const paymentAttemptRelations = relations(paymentAttempts, ({ one }) => ({
  intent: one(paymentIntents, {
    fields: [paymentAttempts.intentId],
    references: [paymentIntents.id],
  }),
  provider: one(paymentProviders, {
    fields: [paymentAttempts.providerId],
    references: [paymentProviders.id],
  }),
  payment: one(payments),
}));

export const paymentRelations = relations(payments, ({ one, many }) => ({
  attempt: one(paymentAttempts, {
    fields: [payments.attemptId],
    references: [paymentAttempts.id],
  }),
  refunds: many(refunds),
}));

export const refundRelations = relations(refunds, ({ one }) => ({
  payment: one(payments, {
    fields: [refunds.paymentId],
    references: [payments.id],
  }),
}));

export const webhookEventRelations = relations(webhookEvents, ({ one }) => ({
  provider: one(paymentProviders, {
    fields: [webhookEvents.providerId],
    references: [paymentProviders.id],
  }),
}));
