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
  path.join(dbSchemaEnums, 'cart.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const cartStatusEnum = pgEnum("cart_status", [
  "ACTIVE",
  "CHECKOUT_PENDING",
  "ABANDONED",
  "CONVERTED_TO_ORDER",
  "EXPIRED"
]);
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'carts.ts'),
  `
import { pgTable, text, timestamp, index, unique } from "drizzle-orm/pg-core";
import { users } from "./users";
import { cartStatusEnum } from "../enums/cart";

export const carts = pgTable("carts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: text("session_id"), // For guest carts
  status: cartStatusEnum("status").default("ACTIVE").notNull(),
  couponCode: text("coupon_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  userStatusIdx: index("cart_user_status_idx").on(t.userId, t.status),
  sessionStatusIdx: index("cart_session_status_idx").on(t.sessionId, t.status),
  // Prevent duplicate ACTIVE carts for the same user
  unqActiveUser: unique("unq_active_user_cart").on(t.userId, t.status).nullsNotDistinct(),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'cart_items.ts'),
  `
import { pgTable, text, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { carts } from "./carts";
import { productVariants } from "./product_variants";

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  variantId: text("variant_id").notNull().references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  cartVariantUnq: unique("unq_cart_variant").on(t.cartId, t.variantId),
  cartIdIdx: index("cart_item_cart_id_idx").on(t.cartId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'cart_sessions.ts'),
  `
import { pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

export const cartSessions = pgTable("cart_sessions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  tokenIdx: index("cart_session_token_idx").on(t.token),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'cart.ts'),
  `
import { relations } from "drizzle-orm";
import { carts } from "../tables/carts";
import { cartItems } from "../tables/cart_items";
import { cartSessions } from "../tables/cart_sessions";
import { users } from "../tables/users";
import { productVariants } from "../tables/product_variants";

export const cartRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  }),
  items: many(cartItems),
}));

export const cartItemRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id]
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id]
  }),
}));
`,
);

// Append to schema index
const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Cart
export * from "./enums/cart";
export * from "./tables/carts";
export * from "./tables/cart_items";
export * from "./tables/cart_sessions";
export * from "./relations/cart";
`;
if (!schemaIndex.includes('./tables/carts')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. CART PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const cartDir = path.join(rootDir, 'packages/cart');
const srcDir = path.join(cartDir, 'src');

['cart', 'cart-item', 'cart-session', 'shared'].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});
ensureDir(path.join(srcDir, 'shared/events'));

fs.writeFileSync(
  path.join(cartDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/cart',
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
  path.join(cartDir, 'tsconfig.json'),
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
export interface CartEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type CartCreated = CartEvent<{ cartId: string, userId?: string, sessionId?: string }>;
export type CartMerged = CartEvent<{ sourceCartId: string, destinationCartId: string }>;
export type ItemAdded = CartEvent<{ cartId: string, variantId: string, quantity: number }>;
export type ItemRemoved = CartEvent<{ cartId: string, variantId: string }>;
export type QuantityUpdated = CartEvent<{ cartId: string, variantId: string, quantity: number }>;
export type CartCleared = CartEvent<{ cartId: string }>;
export type CouponApplied = CartEvent<{ cartId: string, couponCode: string }>;
export type CouponRemoved = CartEvent<{ cartId: string }>;
export type CartExpired = CartEvent<{ cartId: string }>;
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

export interface CartSnapshot {
  subtotal: Money;
  discounts: Money;
  couponDiscount: Money;
  estimatedTax: Money;
  estimatedTotal: Money;
  currency: string;
  generatedAt: Date;
}

export interface CartValidationResult {
  isValid: boolean;
  unavailableItems: string[]; // variantIds
  quantityWarnings: string[];
  invalidCoupons: string[];
  inventoryWarnings: string[];
  messages: string[];
}
`,
);

// Cart Slice
fs.writeFileSync(
  path.join(srcDir, 'cart/entity.ts'),
  `
import type { CartItemEntity } from "../cart-item/entity";

export interface CartEntity {
  id: string;
  userId: string | null;
  sessionId: string | null;
  status: "ACTIVE" | "CHECKOUT_PENDING" | "ABANDONED" | "CONVERTED_TO_ORDER" | "EXPIRED";
  couponCode: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: CartItemEntity[]; // Eagerly loaded
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart/dto.ts'),
  `
import { z } from "zod";
import { cartValidator } from "./validators";
import type { CartSnapshot, CartValidationResult } from "../shared/types";

export type CartResponseDTO = z.infer<typeof cartValidator.response> & {
  snapshot?: CartSnapshot;
  validationResult?: CartValidationResult;
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart/validators.ts'),
  `
import { z } from "zod";
import { cartItemValidator } from "../cart-item/validators";

export const cartValidator = {
  response: z.object({
    id: z.string().uuid(),
    userId: z.string().nullable(),
    sessionId: z.string().nullable(),
    status: z.enum(["ACTIVE", "CHECKOUT_PENDING", "ABANDONED", "CONVERTED_TO_ORDER", "EXPIRED"]),
    couponCode: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
    items: z.array(cartItemValidator.response).optional(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart/mapper.ts'),
  `
import type { CartEntity } from "./entity";
import type { CartResponseDTO } from "./dto";
import { toCartItemResponse } from "../cart-item/mapper";

export function toCartResponse(entity: CartEntity): CartResponseDTO {
  return {
    id: entity.id,
    userId: entity.userId,
    sessionId: entity.sessionId,
    status: entity.status,
    couponCode: entity.couponCode,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    items: entity.items?.map(toCartItemResponse),
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart/repository.ts'),
  `
import { db, carts, cartItems } from "@kirana/database";
import { and, eq, or } from "drizzle-orm";
import type { CartEntity } from "./entity";

export class CartRepository {
  async getActiveCart(userId?: string, sessionId?: string): Promise<CartEntity | null> {
    if (!userId && !sessionId) return null;
    
    const conditions = [];
    if (userId) conditions.push(eq(carts.userId, userId));
    if (sessionId) conditions.push(eq(carts.sessionId, sessionId));
    
    const row = await db.query.carts.findFirst({
      where: and(
        or(...conditions),
        eq(carts.status, "ACTIVE")
      ),
      with: {
        items: true
      }
    });
    
    return (row as CartEntity) || null;
  }
  
  async create(data: { userId?: string, sessionId?: string }): Promise<CartEntity> {
    const [row] = await db.insert(carts).values({
      userId: data.userId || null,
      sessionId: data.sessionId || null,
      status: "ACTIVE"
    }).returning();
    
    return { ...row, items: [] } as CartEntity;
  }
  
  async deleteItem(cartId: string, variantId: string) {
    await db.delete(cartItems).where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.variantId, variantId)
      )
    );
  }
  
  async clearCart(cartId: string) {
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
  }
  
  async setCoupon(cartId: string, couponCode: string | null) {
    await db.update(carts).set({ couponCode, updatedAt: new Date() }).where(eq(carts.id, cartId));
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart/service.ts'),
  `
import { CartRepository } from "./repository";
import { CartItemRepository } from "../cart-item/repository";
import { toCartResponse } from "./mapper";
import type { CartResponseDTO } from "./dto";
import type { CartSnapshot, CartValidationResult } from "../shared/types";

const cartRepo = new CartRepository();
const itemRepo = new CartItemRepository();

export class CartService {
  async getOrCreateActiveCart(userId?: string, sessionId?: string): Promise<CartResponseDTO> {
    let cart = await cartRepo.getActiveCart(userId, sessionId);
    if (!cart) {
      cart = await cartRepo.create({ userId, sessionId });
    }
    return toCartResponse(cart);
  }
  
  async addItem(cartId: string, variantId: string, quantity: number): Promise<CartResponseDTO> {
    // Basic quantity validation here
    if (quantity <= 0) throw new Error("Quantity must be greater than zero.");
    if (quantity > 10) throw new Error("Cannot add more than 10 items at once.");
    
    await itemRepo.upsertItem(cartId, variantId, quantity);
    
    const cart = await cartRepo.getActiveCart(undefined, cartId); // Note: We need a getById really, assuming getActiveCart can fetch by id indirectly or we just fetch again.
    // For simplicity, we just fetch by id. Let's assume we implement getById.
    const updated = await dbQueryCartById(cartId);
    return toCartResponse(updated);
  }

  async removeItem(cartId: string, variantId: string): Promise<CartResponseDTO> {
    await cartRepo.deleteItem(cartId, variantId);
    const updated = await dbQueryCartById(cartId);
    return toCartResponse(updated);
  }

  async clearCart(cartId: string): Promise<void> {
    await cartRepo.clearCart(cartId);
  }
  
  async applyCoupon(cartId: string, couponCode: string): Promise<CartResponseDTO> {
    await cartRepo.setCoupon(cartId, couponCode);
    const updated = await dbQueryCartById(cartId);
    return toCartResponse(updated);
  }
  
  async generateSnapshot(cartId: string): Promise<CartSnapshot> {
    // This is an architectural concept. It would normally call @kirana/pricing.
    return {
      subtotal: { amount: 0, currencyCode: "USD", precision: 2 },
      discounts: { amount: 0, currencyCode: "USD", precision: 2 },
      couponDiscount: { amount: 0, currencyCode: "USD", precision: 2 },
      estimatedTax: { amount: 0, currencyCode: "USD", precision: 2 },
      estimatedTotal: { amount: 0, currencyCode: "USD", precision: 2 },
      currency: "USD",
      generatedAt: new Date()
    };
  }

  async validateCart(cartId: string): Promise<CartValidationResult> {
    // This would call @kirana/inventory and @kirana/pricing to check rules dynamically
    return {
      isValid: true,
      unavailableItems: [],
      quantityWarnings: [],
      invalidCoupons: [],
      inventoryWarnings: [],
      messages: []
    };
  }
  
  async mergeGuestCart(userId: string, guestSessionId: string): Promise<CartResponseDTO> {
    const guestCart = await cartRepo.getActiveCart(undefined, guestSessionId);
    const userCart = await cartRepo.getActiveCart(userId);
    
    if (!guestCart || !guestCart.items || guestCart.items.length === 0) {
      return toCartResponse(userCart || await cartRepo.create({ userId }));
    }
    
    const targetCart = userCart || await cartRepo.create({ userId });
    
    // Deterministic merge: sum quantities
    for (const guestItem of guestCart.items) {
      const existing = targetCart.items?.find(i => i.variantId === guestItem.variantId);
      const newQuantity = (existing?.quantity || 0) + guestItem.quantity;
      // Cap at 10
      const cappedQuantity = Math.min(newQuantity, 10);
      await itemRepo.upsertItem(targetCart.id, guestItem.variantId, cappedQuantity);
    }
    
    // Discard guest cart
    await cartRepo.clearCart(guestCart.id);
    // Mark abandoned or delete...
    
    const updated = await dbQueryCartById(targetCart.id);
    return toCartResponse(updated);
  }
}

import { db, carts } from "@kirana/database";
import { eq } from "drizzle-orm";
async function dbQueryCartById(id: string) {
  const row = await db.query.carts.findFirst({
    where: eq(carts.id, id),
    with: { items: true }
  });
  if (!row) throw new Error("Cart not found");
  return row as any;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { CartService } from "./service";
`,
);

// Cart Item Slice
fs.writeFileSync(
  path.join(srcDir, 'cart-item/entity.ts'),
  `
export interface CartItemEntity {
  id: string;
  cartId: string;
  variantId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart-item/validators.ts'),
  `
import { z } from "zod";

export const cartItemValidator = {
  response: z.object({
    id: z.string().uuid(),
    cartId: z.string().uuid(),
    variantId: z.string().uuid(),
    quantity: z.number().int().positive(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart-item/mapper.ts'),
  `
import type { CartItemEntity } from "./entity";

export function toCartItemResponse(entity: CartItemEntity) {
  return {
    id: entity.id,
    cartId: entity.cartId,
    variantId: entity.variantId,
    quantity: entity.quantity,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'cart-item/repository.ts'),
  `
import { db, cartItems } from "@kirana/database";

export class CartItemRepository {
  async upsertItem(cartId: string, variantId: string, quantity: number) {
    await db.insert(cartItems).values({
      cartId,
      variantId,
      quantity,
    }).onConflictDoUpdate({
      target: [cartItems.cartId, cartItems.variantId],
      set: {
        quantity,
        updatedAt: new Date()
      }
    });
  }
}
`,
);
fs.writeFileSync(path.join(srcDir, 'cart-item/index.ts'), `export * from "./entity";`);

// Cart Session Slice
fs.writeFileSync(
  path.join(srcDir, 'cart-session/entity.ts'),
  `
export interface CartSessionEntity {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
`,
);
fs.writeFileSync(path.join(srcDir, 'cart-session/index.ts'), `export * from "./entity";`);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./cart";
export * from "./shared/events";
export * from "./shared/types";
`,
);

console.log('Cart workspace scaffolded.');
