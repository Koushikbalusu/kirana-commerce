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
  path.join(dbSchemaEnums, 'payments.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const paymentIntentStatusEnum = pgEnum("payment_intent_status", [
  "REQUIRES_PAYMENT_METHOD",
  "REQUIRES_ACTION",
  "PROCESSING",
  "SUCCEEDED",
  "CANCELED"
]);

export const paymentInternalStatusEnum = pgEnum("payment_internal_status", [
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED"
]);

export const captureStrategyEnum = pgEnum("capture_strategy", [
  "AUTOMATIC",
  "MANUAL"
]);

export const refundStatusEnum = pgEnum("refund_status", [
  "PENDING",
  "SUCCEEDED",
  "FAILED"
]);

export const webhookStatusEnum = pgEnum("webhook_status", [
  "RECEIVED",
  "VALIDATED",
  "PROCESSED",
  "FAILED"
]);
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'payment_providers.ts'),
  `
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const paymentProviders = pgTable("payment_providers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(), // e.g. STRIPE, RAZORPAY
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'provider_configurations.ts'),
  `
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { paymentProviders } from "./payment_providers";

export const providerConfigurations = pgTable("provider_configurations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId: text("provider_id").notNull().references(() => paymentProviders.id),
  environment: text("environment").notNull(), // TEST, LIVE
  isActive: boolean("is_active").default(true).notNull(),
  apiKeysReference: text("api_keys_reference").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'payment_intents.ts'),
  `
import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { captureStrategyEnum, paymentIntentStatusEnum } from "../enums/payments";

export const paymentIntents = pgTable("payment_intents", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: paymentIntentStatusEnum("status").default("REQUIRES_PAYMENT_METHOD").notNull(),
  captureStrategy: captureStrategyEnum("capture_strategy").default("AUTOMATIC").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'payment_attempts.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { paymentIntents } from "./payment_intents";
import { paymentProviders } from "./payment_providers";
import { paymentInternalStatusEnum } from "../enums/payments";

export const paymentAttempts = pgTable("payment_attempts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  intentId: text("intent_id").notNull().references(() => paymentIntents.id),
  providerId: text("provider_id").notNull().references(() => paymentProviders.id),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  status: paymentInternalStatusEnum("status").default("PENDING").notNull(),
  failureCode: text("failure_code"),
  failureReason: text("failure_reason"),
  providerMetadata: jsonb("provider_metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  intentIdx: index("payment_attempt_intent_idx").on(t.intentId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'payments.ts'),
  `
import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { paymentAttempts } from "./payment_attempts";
import { paymentInternalStatusEnum } from "../enums/payments";

export const payments = pgTable("payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  attemptId: text("attempt_id").notNull().unique().references(() => paymentAttempts.id),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  currencyPrecision: integer("currency_precision").notNull(),
  internalStatus: paymentInternalStatusEnum("internal_status").notNull(),
  providerMetadata: jsonb("provider_metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  attemptIdx: index("payment_attempt_id_idx").on(t.attemptId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'refunds.ts'),
  `
import { pgTable, text, timestamp, integer, jsonb, index } from "drizzle-orm/pg-core";
import { payments } from "./payments";
import { refundStatusEnum } from "../enums/payments";

export const refunds = pgTable("refunds", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  paymentId: text("payment_id").notNull().references(() => payments.id),
  providerRefundId: text("provider_refund_id"),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  status: refundStatusEnum("status").default("PENDING").notNull(),
  providerMetadata: jsonb("provider_metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  paymentIdx: index("refund_payment_idx").on(t.paymentId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'webhook_events.ts'),
  `
import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { paymentProviders } from "./payment_providers";
import { webhookStatusEnum } from "../enums/payments";

export const webhookEvents = pgTable("webhook_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  providerId: text("provider_id").notNull().references(() => paymentProviders.id),
  eventType: text("event_type").notNull(),
  payload: jsonb("payload").notNull(),
  status: webhookStatusEnum("status").default("RECEIVED").notNull(),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  providerIdx: index("webhook_provider_idx").on(t.providerId),
  statusIdx: index("webhook_status_idx").on(t.status),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'payments.ts'),
  `
import { relations } from "drizzle-orm";
import { paymentProviders } from "../tables/payment_providers";
import { providerConfigurations } from "../tables/provider_configurations";
import { paymentIntents } from "../tables/payment_intents";
import { paymentAttempts } from "../tables/payment_attempts";
import { payments } from "../tables/payments";
import { refunds } from "../tables/refunds";
import { webhookEvents } from "../tables/webhook_events";

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
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Payments
export * from "./enums/payments";
export * from "./tables/payment_providers";
export * from "./tables/provider_configurations";
export * from "./tables/payment_intents";
export * from "./tables/payment_attempts";
export * from "./tables/payments";
export * from "./tables/refunds";
export * from "./tables/webhook_events";
export * from "./relations/payments";
`;
if (!schemaIndex.includes('./tables/payments')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. PAYMENTS PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const paymentsDir = path.join(rootDir, 'packages/payments');
const srcDir = path.join(paymentsDir, 'src');

[
  'payment',
  'payment-intent',
  'payment-attempt',
  'refund',
  'provider',
  'webhook',
  'reconciliation',
  'shared',
].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});
ensureDir(path.join(srcDir, 'shared/events'));

fs.writeFileSync(
  path.join(paymentsDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/payments',
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
  path.join(paymentsDir, 'tsconfig.json'),
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
export interface PaymentEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type PaymentIntentCreated = PaymentEvent<{ intentId: string }>;
export type PaymentAuthorized = PaymentEvent<{ paymentId: string }>;
export type PaymentCaptured = PaymentEvent<{ paymentId: string }>;
export type PaymentFailed = PaymentEvent<{ attemptId: string, failureCode: string }>;
export type RefundCreated = PaymentEvent<{ refundId: string }>;
export type RefundCompleted = PaymentEvent<{ refundId: string }>;
export type WebhookReceived = PaymentEvent<{ webhookId: string }>;
`,
);

// Shared Types (Money)
fs.writeFileSync(
  path.join(srcDir, 'shared/types.ts'),
  `
export interface Money {
  amount: number;
  currencyCode: string;
  precision: number;
}
`,
);

// Payment Intent Slice
fs.writeFileSync(
  path.join(srcDir, 'payment-intent/entity.ts'),
  `
export interface PaymentIntentEntity {
  id: string;
  amount: number;
  currency: string;
  status: "REQUIRES_PAYMENT_METHOD" | "REQUIRES_ACTION" | "PROCESSING" | "SUCCEEDED" | "CANCELED";
  captureStrategy: "AUTOMATIC" | "MANUAL";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'payment-intent/index.ts'), `export * from "./entity";`);

// Payment Attempt Slice
fs.writeFileSync(
  path.join(srcDir, 'payment-attempt/entity.ts'),
  `
export interface PaymentAttemptEntity {
  id: string;
  intentId: string;
  providerId: string;
  idempotencyKey: string;
  status: "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED";
  failureCode: string | null;
  failureReason: string | null;
  providerMetadata: any;
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'payment-attempt/index.ts'), `export * from "./entity";`);

// Payment Slice
fs.writeFileSync(
  path.join(srcDir, 'payment/entity.ts'),
  `
export interface PaymentEntity {
  id: string;
  attemptId: string;
  amount: number;
  currency: string;
  currencyPrecision: number;
  internalStatus: "PENDING" | "AUTHORIZED" | "CAPTURED" | "FAILED";
  providerMetadata: any;
  createdAt: Date;
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'payment/dto.ts'),
  `
import { z } from "zod";

export const paymentResponseSchema = z.object({
  id: z.string().uuid(),
  attemptId: z.string().uuid(),
  amount: z.number().int(),
  currency: z.string(),
  currencyPrecision: z.number().int(),
  internalStatus: z.enum(["PENDING", "AUTHORIZED", "CAPTURED", "FAILED"]),
  providerMetadata: z.any(),
  createdAt: z.date(),
});

export type PaymentResponseDTO = z.infer<typeof paymentResponseSchema>;
`,
);
fs.writeFileSync(
  path.join(srcDir, 'payment/mapper.ts'),
  `
import type { PaymentEntity } from "./entity";
import type { PaymentResponseDTO } from "./dto";

export function toPaymentResponse(entity: PaymentEntity): PaymentResponseDTO {
  return { ...entity };
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'payment/repository.ts'),
  `
import { db, payments } from "@kirana/database";
import { eq } from "drizzle-orm";
import type { PaymentEntity } from "./entity";

export class PaymentRepository {
  async getById(id: string): Promise<PaymentEntity | null> {
    const row = await db.query.payments.findFirst({ where: eq(payments.id, id) });
    return (row as PaymentEntity) || null;
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'payment/service.ts'),
  `
import { PaymentRepository } from "./repository";
import { toPaymentResponse } from "./mapper";
import type { PaymentResponseDTO } from "./dto";

const paymentRepo = new PaymentRepository();

export class PaymentService {
  async getPayment(id: string): Promise<PaymentResponseDTO> {
    const payment = await paymentRepo.getById(id);
    if (!payment) throw new Error("Payment not found");
    return toPaymentResponse(payment);
  }
  
  // Implementation of orchestration: create intent -> attempt -> payment
  // (Stubbed per architecture contract)
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'payment/index.ts'),
  `
export * from "./dto";
export { PaymentService } from "./service";
`,
);

// Refund Slice
fs.writeFileSync(
  path.join(srcDir, 'refund/entity.ts'),
  `
export interface RefundEntity {
  id: string;
  paymentId: string;
  providerRefundId: string | null;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED";
  providerMetadata: any;
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'refund/index.ts'), `export * from "./entity";`);

// Provider Layer (Adapter Pattern)
fs.writeFileSync(
  path.join(srcDir, 'provider/index.ts'),
  `
export interface PaymentProviderAdapter {
  authorize(amount: number, currency: string, idempotencyKey: string): Promise<any>;
  capture(providerTransactionId: string, amount?: number): Promise<any>;
  refund(providerTransactionId: string, amount: number): Promise<any>;
}
// Do not implement Stripe SDK, Razorpay SDK, etc. Only the interface.
`,
);

// Webhook Slice
fs.writeFileSync(
  path.join(srcDir, 'webhook/entity.ts'),
  `
export interface WebhookEventEntity {
  id: string;
  providerId: string;
  eventType: string;
  payload: any;
  status: "RECEIVED" | "VALIDATED" | "PROCESSED" | "FAILED";
  processedAt: Date | null;
  createdAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'webhook/index.ts'), `export * from "./entity";`);

// Reconciliation Slice (Future Ready)
fs.writeFileSync(
  path.join(srcDir, 'reconciliation/index.ts'),
  `
export interface ReconciliationJob {
  // Scaffolding only
}
`,
);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./payment";
export * from "./shared/events";
export * from "./shared/types";
`,
);

console.log('Payments workspace scaffolded.');
