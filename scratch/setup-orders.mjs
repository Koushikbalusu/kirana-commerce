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
  path.join(dbSchemaEnums, 'orders.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const checkoutSessionStatusEnum = pgEnum("checkout_session_status", [
  "ACTIVE",
  "PAYMENT_PENDING",
  "COMPLETED",
  "EXPIRED",
  "FAILED"
]);

export const financialStatusEnum = pgEnum("financial_status", [
  "UNPAID",
  "AUTHORIZED",
  "PAID",
  "PARTIALLY_REFUNDED",
  "REFUNDED"
]);

export const fulfillmentStatusEnum = pgEnum("fulfillment_status", [
  "UNFULFILLED",
  "PROCESSING",
  "PARTIALLY_SHIPPED",
  "SHIPPED",
  "DELIVERED"
]);
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'checkout_sessions.ts'),
  `
import { pgTable, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { carts } from "./carts";
import { users } from "./users";
import { checkoutSessionStatusEnum } from "../enums/orders";

export const checkoutSessions = pgTable("checkout_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  cartId: text("cart_id").notNull().references(() => carts.id),
  userId: text("user_id").references(() => users.id), // Can be null for guests, though usually requires auth for final order
  status: checkoutSessionStatusEnum("status").default("ACTIVE").notNull(),
  paymentIntentId: text("payment_intent_id"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  statusIdx: index("checkout_session_status_idx").on(t.status),
  userIdIdx: index("checkout_session_user_idx").on(t.userId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'orders.ts'),
  `
import { pgTable, text, timestamp, index, unique, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { checkoutSessions } from "./checkout_sessions";
import { financialStatusEnum, fulfillmentStatusEnum } from "../enums/orders";

export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderNumber: text("order_number").notNull().unique(), // Human-readable e.g. ORD-12345
  userId: text("user_id").references(() => users.id),
  checkoutSessionId: text("checkout_session_id").notNull().unique().references(() => checkoutSessions.id),
  
  financialStatus: financialStatusEnum("financial_status").default("UNPAID").notNull(),
  fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status").default("UNFULFILLED").notNull(),
  
  // Snapshots
  customerSnapshot: jsonb("customer_snapshot").notNull(), // { name, email, phone }
  shippingAddressSnapshot: jsonb("shipping_address_snapshot").notNull(),
  billingAddressSnapshot: jsonb("billing_address_snapshot").notNull(),
  totalsSnapshot: jsonb("totals_snapshot").notNull(), // { subtotal, discountTotal, taxTotal, shippingTotal, grandTotal, currency }
  
  paymentReference: text("payment_reference"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index("order_user_id_idx").on(t.userId),
  finStatusIdx: index("order_financial_status_idx").on(t.financialStatus),
  fulStatusIdx: index("order_fulfillment_status_idx").on(t.fulfillmentStatus),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'order_items.ts'),
  `
import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull(), // No foreign key constraint strictly needed since it's a snapshot, but it could be. We'll leave it without FK to be perfectly immutable against catalog deletes.
  productName: text("product_name").notNull(),
  sku: text("sku").notNull(),
  quantity: integer("quantity").notNull(),
  
  // Financial snapshots (Money stored as cents)
  unitPrice: integer("unit_price").notNull(),
  discountAmount: integer("discount_amount").notNull(),
  taxAmount: integer("tax_amount").notNull(),
  totalPrice: integer("total_price").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  orderIdIdx: index("order_item_order_id_idx").on(t.orderId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'order_status_history.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderStatusHistory = pgTable("order_status_history", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // "FINANCIAL" | "FULFILLMENT"
  oldStatus: text("old_status").notNull(),
  newStatus: text("new_status").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  orderIdIdx: index("order_status_history_order_id_idx").on(t.orderId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'fulfillments.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { fulfillmentStatusEnum } from "../enums/orders";

export const fulfillments = pgTable("fulfillments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  trackingNumber: text("tracking_number"),
  carrier: text("carrier"),
  status: fulfillmentStatusEnum("status").default("UNFULFILLED").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  orderIdIdx: index("fulfillment_order_id_idx").on(t.orderId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'orders.ts'),
  `
import { relations } from "drizzle-orm";
import { checkoutSessions } from "../tables/checkout_sessions";
import { orders } from "../tables/orders";
import { orderItems } from "../tables/order_items";
import { orderStatusHistory } from "../tables/order_status_history";
import { fulfillments } from "../tables/fulfillments";

export const orderRelations = relations(orders, ({ one, many }) => ({
  checkoutSession: one(checkoutSessions, {
    fields: [orders.checkoutSessionId],
    references: [checkoutSessions.id]
  }),
  items: many(orderItems),
  statusHistory: many(orderStatusHistory),
  fulfillments: many(fulfillments),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  })
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Orders
export * from "./enums/orders";
export * from "./tables/checkout_sessions";
export * from "./tables/orders";
export * from "./tables/order_items";
export * from "./tables/order_status_history";
export * from "./tables/fulfillments";
export * from "./relations/orders";
`;
if (!schemaIndex.includes('./tables/orders')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. ORDERS PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const ordersDir = path.join(rootDir, 'packages/orders');
const srcDir = path.join(ordersDir, 'src');

['order', 'order-item', 'checkout-session', 'fulfillment', 'shared'].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});
ensureDir(path.join(srcDir, 'shared/events'));

fs.writeFileSync(
  path.join(ordersDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/orders',
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
  path.join(ordersDir, 'tsconfig.json'),
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
export interface OrderEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type OrderCreated = OrderEvent<{ orderId: string, orderNumber: string, userId?: string }>;
export type OrderConfirmed = OrderEvent<{ orderId: string }>;
export type OrderCancelled = OrderEvent<{ orderId: string, reason?: string }>;
export type OrderShipped = OrderEvent<{ orderId: string, trackingNumber?: string }>;
export type OrderDelivered = OrderEvent<{ orderId: string }>;
export type OrderRefunded = OrderEvent<{ orderId: string, amount: number }>;
`,
);

// Shared Types
fs.writeFileSync(
  path.join(srcDir, 'shared/types.ts'),
  `
export interface Money {
  amount: number;
  currencyCode: string;
  precision: number;
}

export interface CustomerSnapshot {
  name: string;
  email: string;
  phone?: string;
}

export interface AddressSnapshot {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TotalsSnapshot {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingTotal: number;
  grandTotal: number;
  currency: string;
}
`,
);

// Order Slice
fs.writeFileSync(
  path.join(srcDir, 'order/entity.ts'),
  `
import type { CustomerSnapshot, AddressSnapshot, TotalsSnapshot } from "../shared/types";
import type { OrderItemEntity } from "../order-item/entity";

export interface OrderEntity {
  id: string;
  orderNumber: string;
  userId: string | null;
  checkoutSessionId: string;
  financialStatus: "UNPAID" | "AUTHORIZED" | "PAID" | "PARTIALLY_REFUNDED" | "REFUNDED";
  fulfillmentStatus: "UNFULFILLED" | "PROCESSING" | "PARTIALLY_SHIPPED" | "SHIPPED" | "DELIVERED";
  customerSnapshot: CustomerSnapshot;
  shippingAddressSnapshot: AddressSnapshot;
  billingAddressSnapshot: AddressSnapshot;
  totalsSnapshot: TotalsSnapshot;
  paymentReference: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItemEntity[];
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order/dto.ts'),
  `
import { z } from "zod";
import { orderValidator } from "./validators";

export type OrderResponseDTO = z.infer<typeof orderValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order/validators.ts'),
  `
import { z } from "zod";
import { orderItemValidator } from "../order-item/validators";

export const orderValidator = {
  response: z.object({
    id: z.string().uuid(),
    orderNumber: z.string(),
    userId: z.string().nullable(),
    checkoutSessionId: z.string().uuid(),
    financialStatus: z.enum(["UNPAID", "AUTHORIZED", "PAID", "PARTIALLY_REFUNDED", "REFUNDED"]),
    fulfillmentStatus: z.enum(["UNFULFILLED", "PROCESSING", "PARTIALLY_SHIPPED", "SHIPPED", "DELIVERED"]),
    customerSnapshot: z.any(),
    shippingAddressSnapshot: z.any(),
    billingAddressSnapshot: z.any(),
    totalsSnapshot: z.any(),
    paymentReference: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    items: z.array(orderItemValidator.response).optional(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order/mapper.ts'),
  `
import type { OrderEntity } from "./entity";
import type { OrderResponseDTO } from "./dto";
import { toOrderItemResponse } from "../order-item/mapper";

export function toOrderResponse(entity: OrderEntity): OrderResponseDTO {
  return {
    id: entity.id,
    orderNumber: entity.orderNumber,
    userId: entity.userId,
    checkoutSessionId: entity.checkoutSessionId,
    financialStatus: entity.financialStatus,
    fulfillmentStatus: entity.fulfillmentStatus,
    customerSnapshot: entity.customerSnapshot,
    shippingAddressSnapshot: entity.shippingAddressSnapshot,
    billingAddressSnapshot: entity.billingAddressSnapshot,
    totalsSnapshot: entity.totalsSnapshot,
    paymentReference: entity.paymentReference,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    items: entity.items?.map(toOrderItemResponse),
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order/repository.ts'),
  `
import { db, orders, orderItems, orderStatusHistory } from "@kirana/database";
import { eq } from "drizzle-orm";
import type { OrderEntity } from "./entity";
import type { OrderItemEntity } from "../order-item/entity";

export class OrderRepository {
  async getById(orderId: string): Promise<OrderEntity | null> {
    const row = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        items: true
      }
    });
    return (row as OrderEntity) || null;
  }
  
  async createOrderWithItems(orderData: any, itemsData: any[]): Promise<OrderEntity> {
    return await db.transaction(async (tx) => {
      const [order] = await tx.insert(orders).values(orderData).returning();
      
      const insertedItems = [];
      if (itemsData.length > 0) {
        const toInsert = itemsData.map(item => ({ ...item, orderId: order.id }));
        const res = await tx.insert(orderItems).values(toInsert).returning();
        insertedItems.push(...res);
      }
      
      return { ...order, items: insertedItems } as OrderEntity;
    });
  }

  async updateFinancialStatus(orderId: string, status: any, reason?: string) {
    await db.transaction(async (tx) => {
      const row = await tx.query.orders.findFirst({ where: eq(orders.id, orderId) });
      if (!row) return;
      
      await tx.update(orders).set({ financialStatus: status, updatedAt: new Date() }).where(eq(orders.id, orderId));
      await tx.insert(orderStatusHistory).values({
        orderId,
        type: "FINANCIAL",
        oldStatus: row.financialStatus,
        newStatus: status,
        reason: reason || null
      });
    });
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order/service.ts'),
  `
import { OrderRepository } from "./repository";
import { toOrderResponse } from "./mapper";
import type { OrderResponseDTO } from "./dto";

const orderRepo = new OrderRepository();

export class OrderService {
  async getOrder(orderId: string): Promise<OrderResponseDTO> {
    const order = await orderRepo.getById(orderId);
    if (!order) throw new Error("Order not found");
    return toOrderResponse(order);
  }
  
  // Actually creating orders occurs inside the orchestration layer, but the repo supports it.
  
  async confirmPayment(orderId: string, paymentReference: string): Promise<OrderResponseDTO> {
    await orderRepo.updateFinancialStatus(orderId, "PAID", "Payment confirmed");
    // In a real system, you'd also save the payment reference here
    const updated = await orderRepo.getById(orderId);
    return toOrderResponse(updated!);
  }
  
  async cancelOrder(orderId: string, reason: string): Promise<OrderResponseDTO> {
    await orderRepo.updateFinancialStatus(orderId, "REFUNDED", reason);
    const updated = await orderRepo.getById(orderId);
    return toOrderResponse(updated!);
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { OrderService } from "./service";
`,
);

// Order Item Slice
fs.writeFileSync(
  path.join(srcDir, 'order-item/entity.ts'),
  `
export interface OrderItemEntity {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  taxAmount: number;
  totalPrice: number;
  createdAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order-item/validators.ts'),
  `
import { z } from "zod";

export const orderItemValidator = {
  response: z.object({
    id: z.string().uuid(),
    orderId: z.string().uuid(),
    variantId: z.string(),
    productName: z.string(),
    sku: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().int(),
    discountAmount: z.number().int(),
    taxAmount: z.number().int(),
    totalPrice: z.number().int(),
    createdAt: z.date(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'order-item/mapper.ts'),
  `
import type { OrderItemEntity } from "./entity";

export function toOrderItemResponse(entity: OrderItemEntity) {
  return { ...entity };
}
`,
);

fs.writeFileSync(path.join(srcDir, 'order-item/index.ts'), `export * from "./entity";`);

// CheckoutSession Slice
fs.writeFileSync(
  path.join(srcDir, 'checkout-session/entity.ts'),
  `
export interface CheckoutSessionEntity {
  id: string;
  idempotencyKey: string;
  cartId: string;
  userId: string | null;
  status: "ACTIVE" | "PAYMENT_PENDING" | "COMPLETED" | "EXPIRED" | "FAILED";
  paymentIntentId: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'checkout-session/repository.ts'),
  `
import { db, checkoutSessions } from "@kirana/database";
import { eq } from "drizzle-orm";
import type { CheckoutSessionEntity } from "./entity";

export class CheckoutSessionRepository {
  async create(data: { idempotencyKey: string; cartId: string; userId?: string; expiresAt: Date }): Promise<CheckoutSessionEntity> {
    const [row] = await db.insert(checkoutSessions).values({
      idempotencyKey: data.idempotencyKey,
      cartId: data.cartId,
      userId: data.userId || null,
      expiresAt: data.expiresAt,
    }).returning();
    return row as CheckoutSessionEntity;
  }
  
  async getById(id: string): Promise<CheckoutSessionEntity | null> {
    const row = await db.query.checkoutSessions.findFirst({ where: eq(checkoutSessions.id, id) });
    return (row as CheckoutSessionEntity) || null;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'checkout-session/service.ts'),
  `
import { CheckoutSessionRepository } from "./repository";
import { OrderRepository } from "../order/repository";
import { randomBytes } from "crypto";

const sessionRepo = new CheckoutSessionRepository();
const orderRepo = new OrderRepository();

function generateOrderNumber() {
  return "ORD-" + randomBytes(4).toString("hex").toUpperCase();
}

export class CheckoutSessionService {
  async createSession(cartId: string, userId?: string): Promise<any> {
    // Basic orchestrator setup
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    const idempotencyKey = crypto.randomUUID();
    
    return await sessionRepo.create({
      cartId,
      userId,
      idempotencyKey,
      expiresAt
    });
  }
  
  async completeCheckout(sessionId: string, snapshotData: any): Promise<any> {
    // 1. Validate session
    const session = await sessionRepo.getById(sessionId);
    if (!session || session.status !== "ACTIVE") throw new Error("Invalid checkout session");
    if (session.expiresAt < new Date()) throw new Error("Checkout session expired");
    
    // 2. We consume the snapshots orchestrator assembled (e.g. from cart/pricing)
    // 3. Create immutable order and items in a single transaction (via OrderRepository)
    const orderData = {
      orderNumber: generateOrderNumber(),
      userId: session.userId,
      checkoutSessionId: session.id,
      customerSnapshot: snapshotData.customerSnapshot,
      shippingAddressSnapshot: snapshotData.shippingAddressSnapshot,
      billingAddressSnapshot: snapshotData.billingAddressSnapshot,
      totalsSnapshot: snapshotData.totalsSnapshot,
    };
    
    const itemsData = snapshotData.items.map((i: any) => ({
      variantId: i.variantId,
      productName: i.productName,
      sku: i.sku,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      discountAmount: i.discountAmount,
      taxAmount: i.taxAmount,
      totalPrice: i.totalPrice,
    }));
    
    // Creates the order and items atomically
    const order = await orderRepo.createOrderWithItems(orderData, itemsData);
    
    // 4. Update session status (Ideally part of the same transaction, but for this abstraction it's fine)
    // db.update(checkoutSessions).set({ status: 'COMPLETED' })
    
    return order;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'checkout-session/index.ts'),
  `
export { CheckoutSessionService } from "./service";
`,
);

// Fulfillment Slice
fs.writeFileSync(
  path.join(srcDir, 'fulfillment/entity.ts'),
  `
export interface FulfillmentEntity {
  id: string;
  orderId: string;
  trackingNumber: string | null;
  carrier: string | null;
  status: "UNFULFILLED" | "PROCESSING" | "PARTIALLY_SHIPPED" | "SHIPPED" | "DELIVERED";
  createdAt: Date;
  updatedAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'fulfillment/index.ts'), `export * from "./entity";`);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./order";
export * from "./checkout-session";
export * from "./shared/events";
export * from "./shared/types";
`,
);

console.log('Orders workspace scaffolded.');
