import { pgEnum } from 'drizzle-orm/pg-core';

export const shipmentStatusEnum = pgEnum('shipment_status', [
  'CREATED',
  'PACKED',
  'READY_FOR_PICKUP',
  'IN_TRANSIT',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'RETURNED',
]);

export const shipmentAttemptStatusEnum = pgEnum('shipment_attempt_status', [
  'PENDING',
  'DISPATCHED',
  'FAILED',
  'COMPLETED',
]);

export const shippingLabelFormatEnum = pgEnum('shipping_label_format', ['PDF', 'PNG', 'ZPL']);
