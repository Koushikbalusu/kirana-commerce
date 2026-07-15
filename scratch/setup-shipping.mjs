import fs from 'fs';
import path from 'path';

const rootDir = '/home/koushik/Documents/kirana-commerce';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ----------------------------------------------------------------------
// 1. DATABASE SCHEMA
// ----------------------------------------------------------------------
const dbSchemaTables = path.join(rootDir, 'packages/database/src/schema/tables');
const dbSchemaEnums = path.join(rootDir, 'packages/database/src/schema/enums');
const dbSchemaRelations = path.join(rootDir, 'packages/database/src/schema/relations');

ensureDir(dbSchemaEnums);
ensureDir(dbSchemaRelations);

fs.writeFileSync(
  path.join(dbSchemaEnums, 'shipping.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const shipmentStatusEnum = pgEnum("shipment_status", [
  "CREATED",
  "PACKED",
  "READY_FOR_PICKUP",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "RETURNED"
]);

export const shipmentAttemptStatusEnum = pgEnum("shipment_attempt_status", [
  "PENDING",
  "DISPATCHED",
  "FAILED",
  "COMPLETED"
]);

export const shippingLabelFormatEnum = pgEnum("shipping_label_format", [
  "PDF",
  "PNG",
  "ZPL"
]);
`,
);

// We redefine fulfillments.ts from Phase 11
fs.writeFileSync(
  path.join(dbSchemaTables, 'fulfillments.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const fulfillments = pgTable("fulfillments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  warehouseId: text("warehouse_id").notNull(),
  status: text("status").default("UNFULFILLED").notNull(), // e.g. UNFULFILLED, PROCESSING, FULFILLED
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  orderIdIdx: index("fulfillment_order_id_idx").on(t.orderId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'carriers.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const carriers = pgTable("carriers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(), // e.g., DELHIVERY, BLUEDART
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'carrier_configurations.ts'),
  `
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { carriers } from "./carriers";

export const carrierConfigurations = pgTable("carrier_configurations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  carrierId: text("carrier_id").notNull().references(() => carriers.id),
  environment: text("environment").notNull(), // TEST, LIVE
  isActive: boolean("is_active").default(true).notNull(),
  apiKeysReference: text("api_keys_reference").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'shipments.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { fulfillments } from "./fulfillments";
import { shipmentStatusEnum } from "../enums/shipping";

export const shipments = pgTable("shipments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  fulfillmentId: text("fulfillment_id").notNull().references(() => fulfillments.id),
  status: shipmentStatusEnum("status").default("CREATED").notNull(),
  shippingAddressSnapshot: jsonb("shipping_address_snapshot").notNull(),
  customerNameSnapshot: text("customer_name_snapshot").notNull(),
  customerPhoneSnapshot: text("customer_phone_snapshot").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  fulfillmentIdx: index("shipment_fulfillment_idx").on(t.fulfillmentId),
  statusIdx: index("shipment_status_idx").on(t.status),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'shipment_attempts.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { shipments } from "./shipments";
import { carriers } from "./carriers";
import { shipmentAttemptStatusEnum } from "../enums/shipping";

export const shipmentAttempts = pgTable("shipment_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  shipmentId: text("shipment_id").notNull().references(() => shipments.id),
  carrierId: text("carrier_id").notNull().references(() => carriers.id),
  trackingNumber: text("tracking_number").notNull(), // internal carrier tracking number
  trackingHash: text("tracking_hash").notNull().unique(), // public safe tracking hash
  status: shipmentAttemptStatusEnum("status").default("PENDING").notNull(),
  carrierMetadata: jsonb("carrier_metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  shipmentIdx: index("shipment_attempt_shipment_idx").on(t.shipmentId),
  trackingHashIdx: index("shipment_attempt_tracking_hash_idx").on(t.trackingHash),
  trackingNumberIdx: index("shipment_attempt_tracking_number_idx").on(t.trackingNumber),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'shipment_items.ts'),
  `
import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { shipments } from "./shipments";

export const shipmentItems = pgTable("shipment_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  shipmentId: text("shipment_id").notNull().references(() => shipments.id),
  orderItemId: text("order_item_id").notNull(),
  sku: text("sku").notNull(),
  productName: text("product_name").notNull(),
  variantName: text("variant_name").notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  shipmentIdx: index("shipment_item_shipment_idx").on(t.shipmentId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'tracking_events.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { shipmentAttempts } from "./shipment_attempts";
import { shipmentStatusEnum } from "../enums/shipping";

export const trackingEvents = pgTable("tracking_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  attemptId: text("attempt_id").notNull().references(() => shipmentAttempts.id),
  internalStatus: shipmentStatusEnum("internal_status").notNull(),
  location: text("location"),
  description: text("description"),
  timestamp: timestamp("timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  attemptIdx: index("tracking_event_attempt_idx").on(t.attemptId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'shipping_labels.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { shipmentAttempts } from "./shipment_attempts";
import { shippingLabelFormatEnum } from "../enums/shipping";

export const shippingLabels = pgTable("shipping_labels", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  attemptId: text("attempt_id").notNull().references(() => shipmentAttempts.id),
  format: shippingLabelFormatEnum("format").notNull(),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  attemptIdx: index("shipping_label_attempt_idx").on(t.attemptId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'shipment_exceptions.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { shipmentAttempts } from "./shipment_attempts";

export const shipmentExceptions = pgTable("shipment_exceptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  attemptId: text("attempt_id").notNull().references(() => shipmentAttempts.id),
  exceptionType: text("exception_type").notNull(), // e.g., Address Invalid, Package Damaged, Lost
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  attemptIdx: index("shipment_exception_attempt_idx").on(t.attemptId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'proof_of_deliveries.ts'),
  `
import { pgTable, text, timestamp, numeric, index } from "drizzle-orm/pg-core";
import { shipmentAttempts } from "./shipment_attempts";

export const proofOfDeliveries = pgTable("proof_of_deliveries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  attemptId: text("attempt_id").notNull().unique().references(() => shipmentAttempts.id),
  signatureUrl: text("signature_url"),
  photoUrl: text("photo_url"),
  otpVerified: text("otp_verified"), // null if not used
  receiverName: text("receiver_name"),
  gpsLatitude: numeric("gps_latitude"),
  gpsLongitude: numeric("gps_longitude"),
  deviceId: text("device_id"),
  deliveryTimestamp: timestamp("delivery_timestamp").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'carrier_webhooks.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { carriers } from "./carriers";

export const carrierWebhooks = pgTable("carrier_webhooks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  carrierId: text("carrier_id").notNull().references(() => carriers.id),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: text("status").default("RECEIVED").notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  carrierIdx: index("carrier_webhook_carrier_idx").on(t.carrierId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'shipping.ts'),
  `
import { relations } from "drizzle-orm";
import { fulfillments } from "../tables/fulfillments";
import { shipments } from "../tables/shipments";
import { shipmentAttempts } from "../tables/shipment_attempts";
import { shipmentItems } from "../tables/shipment_items";
import { trackingEvents } from "../tables/tracking_events";
import { shippingLabels } from "../tables/shipping_labels";
import { shipmentExceptions } from "../tables/shipment_exceptions";
import { proofOfDeliveries } from "../tables/proof_of_deliveries";
import { carriers } from "../tables/carriers";
import { carrierConfigurations } from "../tables/carrier_configurations";
import { carrierWebhooks } from "../tables/carrier_webhooks";

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
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Shipping
export * from "./enums/shipping";
export * from "./tables/carriers";
export * from "./tables/carrier_configurations";
export * from "./tables/shipments";
export * from "./tables/shipment_attempts";
export * from "./tables/shipment_items";
export * from "./tables/tracking_events";
export * from "./tables/shipping_labels";
export * from "./tables/shipment_exceptions";
export * from "./tables/proof_of_deliveries";
export * from "./tables/carrier_webhooks";
export * from "./relations/shipping";
`;
if (!schemaIndex.includes('./tables/shipments')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. SHIPPING PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const shippingDir = path.join(rootDir, 'packages/shipping');
const srcDir = path.join(shippingDir, 'src');

[
  'fulfillment',
  'shipment',
  'shipment-attempt',
  'shipment-item',
  'carrier',
  'tracking',
  'label',
  'address',
  'carrier-webhook',
  'shipment-exception',
  'proof-of-delivery',
  'shared',
  'shared/routing',
  'shared/events',
].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});

fs.writeFileSync(
  path.join(shippingDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/shipping',
      version: '0.1.0',
      private: true,
      main: './src/index.ts',
      types: './src/index.ts',
      dependencies: {
        zod: '^3.23.8',
        '@kirana/database': '*',
        '@kirana/types': '*',
      },
      devDependencies: {
        typescript: '^5.0.0',
        '@types/node': '^20.0.0',
      },
    },
    null,
    2,
  ),
);

fs.writeFileSync(
  path.join(shippingDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '../../tsconfig.base.json',
      compilerOptions: {
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['src'],
    },
    null,
    2,
  ),
);

// Shared Events
fs.writeFileSync(
  path.join(srcDir, 'shared/events/index.ts'),
  `
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
`,
);

// Shared Routing Interfaces
fs.writeFileSync(
  path.join(srcDir, 'shared/routing/index.ts'),
  `
export interface RoutingStrategy {
  selectCarrier(originWarehouseId: string, destinationAddress: any): Promise<string>;
}
// Future strategies: NearestWarehouse, CheapestCarrier, FastestCarrier, BusinessRules
`,
);

// Carrier Adapter Interface
fs.writeFileSync(
  path.join(srcDir, 'carrier/index.ts'),
  `
export interface CarrierAdapter {
  createShipment(payload: any): Promise<any>;
  generateLabel(attemptId: string): Promise<any>;
  schedulePickup(attemptId: string): Promise<any>;
  cancelShipment(attemptId: string): Promise<any>;
  trackShipment(attemptId: string): Promise<any>;
  validateAddress(address: any): Promise<boolean>;
}
// Carrier, CarrierConfiguration entities, repos, services
export * from "./entity";
`,
);

fs.writeFileSync(
  path.join(srcDir, 'carrier/entity.ts'),
  `
export interface CarrierEntity {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
}

export interface CarrierConfigurationEntity {
  id: string;
  carrierId: string;
  environment: string;
  isActive: boolean;
  apiKeysReference: string;
  createdAt: Date;
}
`,
);

// Fulfillment Slice
fs.writeFileSync(
  path.join(srcDir, 'fulfillment/entity.ts'),
  `
export interface FulfillmentEntity {
  id: string;
  orderId: string;
  warehouseId: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'fulfillment/index.ts'), `export * from "./entity";`);

// Shipment Slice
fs.writeFileSync(
  path.join(srcDir, 'shipment/entity.ts'),
  `
export interface ShipmentEntity {
  id: string;
  fulfillmentId: string;
  status: "CREATED" | "PACKED" | "READY_FOR_PICKUP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED";
  shippingAddressSnapshot: any;
  customerNameSnapshot: string;
  customerPhoneSnapshot: string;
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment/dto.ts'),
  `
import { z } from "zod";

export const shipmentResponseSchema = z.object({
  id: z.string().uuid(),
  fulfillmentId: z.string().uuid(),
  status: z.enum(["CREATED", "PACKED", "READY_FOR_PICKUP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "RETURNED"]),
  shippingAddressSnapshot: z.any(),
  customerNameSnapshot: z.string(),
  customerPhoneSnapshot: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ShipmentResponseDTO = z.infer<typeof shipmentResponseSchema>;
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment/mapper.ts'),
  `
import type { ShipmentEntity } from "./entity";
import type { ShipmentResponseDTO } from "./dto";

export function toShipmentResponse(entity: ShipmentEntity): ShipmentResponseDTO {
  return { ...entity };
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment/repository.ts'),
  `
import { db, shipments } from "@kirana/database";
import { eq } from "drizzle-orm";
import type { ShipmentEntity } from "./entity";

export class ShipmentRepository {
  async getById(id: string): Promise<ShipmentEntity | null> {
    const row = await db.query.shipments.findFirst({ where: eq(shipments.id, id) });
    return (row as ShipmentEntity) || null;
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment/service.ts'),
  `
import { ShipmentRepository } from "./repository";
import { toShipmentResponse } from "./mapper";
import type { ShipmentResponseDTO } from "./dto";

const repo = new ShipmentRepository();

export class ShipmentService {
  async getShipment(id: string): Promise<ShipmentResponseDTO> {
    const shipment = await repo.getById(id);
    if (!shipment) throw new Error("Shipment not found");
    return toShipmentResponse(shipment);
  }
  
  async createShipment(payload: any): Promise<ShipmentResponseDTO> {
    throw new Error("Not implemented yet");
  }
  
  async dispatchShipment(id: string): Promise<ShipmentResponseDTO> {
    throw new Error("Not implemented yet");
  }
  
  async completeDelivery(id: string): Promise<ShipmentResponseDTO> {
    throw new Error("Not implemented yet");
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment/index.ts'),
  `
export * from "./dto";
export { ShipmentService } from "./service";
`,
);

// Shipment Attempt Slice
fs.writeFileSync(
  path.join(srcDir, 'shipment-attempt/entity.ts'),
  `
export interface ShipmentAttemptEntity {
  id: string;
  shipmentId: string;
  carrierId: string;
  trackingNumber: string;
  trackingHash: string;
  status: "PENDING" | "DISPATCHED" | "FAILED" | "COMPLETED";
  carrierMetadata: any;
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment-attempt/service.ts'),
  `
export class ShipmentAttemptService {
  async createShipmentAttempt(payload: any): Promise<any> {
    throw new Error("Not implemented yet");
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment-attempt/index.ts'),
  `
export * from "./entity";
export { ShipmentAttemptService } from "./service";
`,
);

// Shipment Item Slice
fs.writeFileSync(
  path.join(srcDir, 'shipment-item/entity.ts'),
  `
export interface ShipmentItemEntity {
  id: string;
  shipmentId: string;
  orderItemId: string;
  sku: string;
  productName: string;
  variantName: string;
  quantity: number;
  createdAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'shipment-item/index.ts'), `export * from "./entity";`);

// Tracking Slice
fs.writeFileSync(
  path.join(srcDir, 'tracking/entity.ts'),
  `
export interface TrackingEventEntity {
  id: string;
  attemptId: string;
  internalStatus: string;
  location: string | null;
  description: string | null;
  timestamp: Date;
  createdAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'tracking/service.ts'),
  `
export class TrackingService {
  async updateTracking(payload: any): Promise<any> {
    throw new Error("Not implemented yet");
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'tracking/index.ts'),
  `
export * from "./entity";
export { TrackingService } from "./service";
`,
);

// Label Slice
fs.writeFileSync(
  path.join(srcDir, 'label/entity.ts'),
  `
export interface ShippingLabelEntity {
  id: string;
  attemptId: string;
  format: "PDF" | "PNG" | "ZPL";
  url: string;
  createdAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'label/service.ts'),
  `
export class LabelService {
  async generateLabel(attemptId: string): Promise<any> {
    throw new Error("Not implemented yet");
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'label/index.ts'),
  `
export * from "./entity";
export { LabelService } from "./service";
`,
);

// Address Slice (Snapshot definitions)
fs.writeFileSync(
  path.join(srcDir, 'address/index.ts'),
  `
export interface AddressSnapshot {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
`,
);

// Carrier Webhook Slice
fs.writeFileSync(
  path.join(srcDir, 'carrier-webhook/entity.ts'),
  `
export interface CarrierWebhookEntity {
  id: string;
  carrierId: string;
  eventType: string;
  payload: any;
  status: string;
  processedAt: Date | null;
  createdAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'carrier-webhook/index.ts'),
  `
export * from "./entity";
`,
);

// Shipment Exception Slice
fs.writeFileSync(
  path.join(srcDir, 'shipment-exception/entity.ts'),
  `
export interface ShipmentExceptionEntity {
  id: string;
  attemptId: string;
  exceptionType: string;
  description: string | null;
  createdAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'shipment-exception/index.ts'),
  `
export * from "./entity";
`,
);

// Proof Of Delivery Slice
fs.writeFileSync(
  path.join(srcDir, 'proof-of-delivery/entity.ts'),
  `
export interface ProofOfDeliveryEntity {
  id: string;
  attemptId: string;
  signatureUrl: string | null;
  photoUrl: string | null;
  otpVerified: string | null;
  receiverName: string | null;
  gpsLatitude: string | null;
  gpsLongitude: string | null;
  deviceId: string | null;
  deliveryTimestamp: Date;
  createdAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'proof-of-delivery/index.ts'),
  `
export * from "./entity";
`,
);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./shipment";
export * from "./shipment-attempt";
export * from "./tracking";
export * from "./label";
export * from "./shared/events";
export * from "./address";
`,
);

console.log('Shipping workspace scaffolded.');
