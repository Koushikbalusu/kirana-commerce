import { relations } from 'drizzle-orm';
import { fulfillments } from '../tables/fulfillments';
import { shipments } from '../tables/shipments';
import { shipmentAttempts } from '../tables/shipment_attempts';
import { shipmentItems } from '../tables/shipment_items';
import { trackingEvents } from '../tables/tracking_events';
import { shippingLabels } from '../tables/shipping_labels';
import { shipmentExceptions } from '../tables/shipment_exceptions';
import { proofOfDeliveries } from '../tables/proof_of_deliveries';
import { carriers } from '../tables/carriers';
import { carrierConfigurations } from '../tables/carrier_configurations';
import { carrierWebhooks } from '../tables/carrier_webhooks';

export const fulfillmentShippingRelations = relations(fulfillments, ({ many }) => ({
  shipments: many(shipments),
}));

export const shipmentRelations = relations(shipments, ({ one, many }) => ({
  fulfillment: one(fulfillments, {
    fields: [shipments.fulfillmentId],
    references: [fulfillments.id],
  }),
  items: many(shipmentItems),
  attempts: many(shipmentAttempts),
}));

export const shipmentAttemptRelations = relations(shipmentAttempts, ({ one, many }) => ({
  shipment: one(shipments, {
    fields: [shipmentAttempts.shipmentId],
    references: [shipments.id],
  }),
  carrier: one(carriers, {
    fields: [shipmentAttempts.carrierId],
    references: [carriers.id],
  }),
  trackingEvents: many(trackingEvents),
  labels: many(shippingLabels),
  exceptions: many(shipmentExceptions),
  proofOfDelivery: one(proofOfDeliveries),
}));

export const carrierRelations = relations(carriers, ({ many }) => ({
  configurations: many(carrierConfigurations),
  attempts: many(shipmentAttempts),
  webhooks: many(carrierWebhooks),
}));
