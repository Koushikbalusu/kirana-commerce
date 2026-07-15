export interface ShippingEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type ShipmentCreated = ShippingEvent<{ shipmentId: string }>;
export type ShipmentPacked = ShippingEvent<{ shipmentId: string }>;
export type PickupScheduled = ShippingEvent<{ attemptId: string }>;
export type ShipmentAttemptCreated = ShippingEvent<{ attemptId: string }>;
export type ShipmentDispatched = ShippingEvent<{ attemptId: string }>;
export type TrackingUpdated = ShippingEvent<{ trackingEventId: string }>;
export type ShipmentDelivered = ShippingEvent<{ attemptId: string }>;
export type ShipmentReturned = ShippingEvent<{ attemptId: string }>;
export type ShipmentExceptionRaised = ShippingEvent<{ exceptionId: string }>;
export type ProofOfDeliveryReceived = ShippingEvent<{ proofId: string }>;
export type CarrierWebhookReceived = ShippingEvent<{ webhookId: string }>;
