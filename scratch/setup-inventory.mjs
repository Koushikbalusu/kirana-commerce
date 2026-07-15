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
  path.join(dbSchemaEnums, 'inventory.ts'),
  `
import { pgEnum } from "drizzle-orm/pg-core";

export const warehouseTypeEnum = pgEnum("warehouse_type", [
  "STORE",
  "FULFILLMENT_CENTER",
  "DARK_STORE",
  "SUPPLIER",
  "TRANSIT"
]);

export const inventoryMovementTypeEnum = pgEnum("inventory_movement_type", [
  "RECEIVED",
  "SHIPPED",
  "RESERVED",
  "RELEASED",
  "TRANSFER_IN",
  "TRANSFER_OUT",
  "RETURNED",
  "DAMAGED",
  "LOST",
  "ADJUSTED"
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "PENDING",
  "CONSUMED",
  "RELEASED",
  "EXPIRED"
]);

export const stockAdjustmentCategoryEnum = pgEnum("stock_adjustment_category", [
  "INITIAL_STOCK",
  "CYCLE_COUNT",
  "MANUAL_ADJUSTMENT",
  "CORRECTION"
]);

export const transferStatusEnum = pgEnum("transfer_status", [
  "PENDING",
  "IN_TRANSIT",
  "COMPLETED",
  "CANCELLED"
]);
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'warehouses.ts'),
  `
import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { warehouseTypeEnum } from "../enums/inventory";

export const warehouses = pgTable("warehouses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  locationCode: text("location_code").notNull().unique(),
  type: warehouseTypeEnum("type").default("FULFILLMENT_CENTER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'inventory.ts'),
  `
import { pgTable, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { productVariants } from "./product_variants";
import { warehouses } from "./warehouses";

export const inventory = pgTable("inventory", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  variantId: text("variant_id").notNull().references(() => productVariants.id),
  warehouseId: text("warehouse_id").notNull().references(() => warehouses.id),
  availableQuantity: integer("available_quantity").default(0).notNull(),
  reservedQuantity: integer("reserved_quantity").default(0).notNull(),
  version: integer("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  unq: unique().on(t.variantId, t.warehouseId),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'reservations.ts'),
  `
import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { inventory } from "./inventory";
import { reservationStatusEnum } from "../enums/inventory";

export const reservations = pgTable("reservations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  inventoryId: text("inventory_id").notNull().references(() => inventory.id),
  ownerType: text("owner_type").notNull(),
  ownerId: text("owner_id").notNull(),
  quantity: integer("quantity").notNull(),
  status: reservationStatusEnum("status").default("PENDING").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({
  expiresAtIdx: index("expires_at_idx").on(t.expiresAt),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'inventory_movements.ts'),
  `
import { pgTable, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { inventory } from "./inventory";
import { inventoryMovementTypeEnum } from "../enums/inventory";

export const inventoryMovements = pgTable("inventory_movements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  inventoryId: text("inventory_id").notNull().references(() => inventory.id),
  type: inventoryMovementTypeEnum("type").notNull(),
  quantity: integer("quantity").notNull(),
  referenceId: text("reference_id"), // Can point to Order ID, Transfer ID, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  inventoryIdIdx: index("movement_inventory_id_idx").on(t.inventoryId),
  createdAtIdx: index("movement_created_at_idx").on(t.createdAt),
}));
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'stock_adjustments.ts'),
  `
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { inventory } from "./inventory";
import { stockAdjustmentCategoryEnum } from "../enums/inventory";

export const stockAdjustments = pgTable("stock_adjustments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  inventoryId: text("inventory_id").notNull().references(() => inventory.id),
  category: stockAdjustmentCategoryEnum("category").notNull(),
  reason: text("reason").notNull(),
  quantityChange: integer("quantity_change").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaTables, 'transfers.ts'),
  `
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { warehouses } from "./warehouses";
import { productVariants } from "./product_variants";
import { transferStatusEnum } from "../enums/inventory";

export const transfers = pgTable("transfers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  sourceWarehouseId: text("source_warehouse_id").notNull().references(() => warehouses.id),
  destinationWarehouseId: text("destination_warehouse_id").notNull().references(() => warehouses.id),
  variantId: text("variant_id").notNull().references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  status: transferStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
`,
);

fs.writeFileSync(
  path.join(dbSchemaRelations, 'inventory.ts'),
  `
import { relations } from "drizzle-orm";
import { productVariants } from "../tables/product_variants";
import { warehouses } from "../tables/warehouses";
import { inventory } from "../tables/inventory";
import { reservations } from "../tables/reservations";
import { inventoryMovements } from "../tables/inventory_movements";
import { stockAdjustments } from "../tables/stock_adjustments";
import { transfers } from "../tables/transfers";

export const warehouseRelations = relations(warehouses, ({ many }) => ({
  inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  variant: one(productVariants, {
    fields: [inventory.variantId],
    references: [productVariants.id]
  }),
  warehouse: one(warehouses, {
    fields: [inventory.warehouseId],
    references: [warehouses.id]
  }),
  reservations: many(reservations),
  movements: many(inventoryMovements),
  adjustments: many(stockAdjustments),
}));

export const reservationRelations = relations(reservations, ({ one }) => ({
  inventory: one(inventory, {
    fields: [reservations.inventoryId],
    references: [inventory.id]
  }),
}));

export const inventoryMovementRelations = relations(inventoryMovements, ({ one }) => ({
  inventory: one(inventory, {
    fields: [inventoryMovements.inventoryId],
    references: [inventory.id]
  }),
}));

export const stockAdjustmentRelations = relations(stockAdjustments, ({ one }) => ({
  inventory: one(inventory, {
    fields: [stockAdjustments.inventoryId],
    references: [inventory.id]
  }),
}));

export const transferRelations = relations(transfers, ({ one }) => ({
  sourceWarehouse: one(warehouses, {
    fields: [transfers.sourceWarehouseId],
    references: [warehouses.id],
    relationName: "source_warehouse_transfers"
  }),
  destinationWarehouse: one(warehouses, {
    fields: [transfers.destinationWarehouseId],
    references: [warehouses.id],
    relationName: "destination_warehouse_transfers"
  }),
  variant: one(productVariants, {
    fields: [transfers.variantId],
    references: [productVariants.id]
  }),
}));
`,
);

const schemaIndexPath = path.join(rootDir, 'packages/database/src/schema/index.ts');
let schemaIndex = fs.readFileSync(schemaIndexPath, 'utf8');
const newExports = `
// Inventory
export * from "./enums/inventory";
export * from "./tables/warehouses";
export * from "./tables/inventory";
export * from "./tables/reservations";
export * from "./tables/inventory_movements";
export * from "./tables/stock_adjustments";
export * from "./tables/transfers";
export * from "./relations/inventory";
`;
if (!schemaIndex.includes('./tables/warehouses')) {
  fs.writeFileSync(schemaIndexPath, schemaIndex.trim() + '\n' + newExports);
}

// ----------------------------------------------------------------------
// 2. INVENTORY PACKAGE (Vertical Slices)
// ----------------------------------------------------------------------
const inventoryDir = path.join(rootDir, 'packages/inventory');
const srcDir = path.join(inventoryDir, 'src');

['inventory', 'warehouse', 'reservation', 'movement', 'shared'].forEach((dir) => {
  ensureDir(path.join(srcDir, dir));
});
ensureDir(path.join(srcDir, 'shared/events'));

fs.writeFileSync(
  path.join(inventoryDir, 'package.json'),
  JSON.stringify(
    {
      name: '@kirana/inventory',
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
  path.join(inventoryDir, 'tsconfig.json'),
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
export interface InventoryEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type InventoryReserved = InventoryEvent<{ inventoryId: string, quantity: number, ownerId: string }>;
export type InventoryReleased = InventoryEvent<{ inventoryId: string, quantity: number, ownerId: string }>;
export type InventoryReceived = InventoryEvent<{ inventoryId: string, quantity: number }>;
export type InventoryAdjusted = InventoryEvent<{ inventoryId: string, quantityChange: number }>;
export type InventoryTransferred = InventoryEvent<{ sourceInventoryId: string, destinationInventoryId: string, quantity: number }>;
export type InventoryReturned = InventoryEvent<{ inventoryId: string, quantity: number }>;
export type InventoryDamaged = InventoryEvent<{ inventoryId: string, quantity: number }>;
export type InventoryLost = InventoryEvent<{ inventoryId: string, quantity: number }>;
`,
);

// Warehouse Slice
fs.writeFileSync(
  path.join(srcDir, 'warehouse/entity.ts'),
  `
export interface WarehouseEntity {
  id: string;
  name: string;
  locationCode: string;
  type: "STORE" | "FULFILLMENT_CENTER" | "DARK_STORE" | "SUPPLIER" | "TRANSIT";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'warehouse/dto.ts'),
  `
import { z } from "zod";
import { warehouseValidator } from "./validators";

export type CreateWarehouseDTO = z.infer<typeof warehouseValidator.create>;
export type WarehouseResponseDTO = z.infer<typeof warehouseValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'warehouse/validators.ts'),
  `
import { z } from "zod";

export const warehouseValidator = {
  create: z.object({
    name: z.string().min(1),
    locationCode: z.string().min(1),
    type: z.enum(["STORE", "FULFILLMENT_CENTER", "DARK_STORE", "SUPPLIER", "TRANSIT"]),
  }),
  response: z.object({
    id: z.string().uuid(),
    name: z.string(),
    locationCode: z.string(),
    type: z.enum(["STORE", "FULFILLMENT_CENTER", "DARK_STORE", "SUPPLIER", "TRANSIT"]),
    isActive: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'warehouse/mapper.ts'),
  `
import type { WarehouseEntity } from "./entity";
import type { WarehouseResponseDTO } from "./dto";

export function toWarehouseResponse(entity: WarehouseEntity): WarehouseResponseDTO {
  return {
    id: entity.id,
    name: entity.name,
    locationCode: entity.locationCode,
    type: entity.type,
    isActive: entity.isActive,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'warehouse/repository.ts'),
  `
import { db, warehouses } from "@kirana/database";
import type { WarehouseEntity } from "./entity";

export class WarehouseRepository {
  async create(data: Omit<WarehouseEntity, "id" | "isActive" | "createdAt" | "updatedAt">): Promise<WarehouseEntity> {
    const [row] = await db.insert(warehouses).values(data).returning();
    return row as WarehouseEntity;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'warehouse/service.ts'),
  `
import { WarehouseRepository } from "./repository";
import { warehouseValidator } from "./validators";
import { toWarehouseResponse } from "./mapper";
import type { CreateWarehouseDTO, WarehouseResponseDTO } from "./dto";

const repo = new WarehouseRepository();

export class WarehouseService {
  async createWarehouse(dto: CreateWarehouseDTO): Promise<WarehouseResponseDTO> {
    const validData = warehouseValidator.create.parse(dto);
    const entity = await repo.create(validData);
    return toWarehouseResponse(entity);
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'warehouse/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { WarehouseService } from "./service";
`,
);

// Movement Slice
fs.writeFileSync(
  path.join(srcDir, 'movement/entity.ts'),
  `
export interface MovementEntity {
  id: string;
  inventoryId: string;
  type: "RECEIVED" | "SHIPPED" | "RESERVED" | "RELEASED" | "TRANSFER_IN" | "TRANSFER_OUT" | "RETURNED" | "DAMAGED" | "LOST" | "ADJUSTED";
  quantity: number;
  referenceId: string | null;
  createdAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'movement/repository.ts'),
  `
import { db, inventoryMovements } from "@kirana/database";
import type { MovementEntity } from "./entity";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "@kirana/database/src/schema";

type Tx = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export class MovementRepository {
  async recordMovement(tx: Tx, data: Omit<MovementEntity, "id" | "createdAt">): Promise<MovementEntity> {
    const [row] = await tx.insert(inventoryMovements).values(data).returning();
    return row as MovementEntity;
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'movement/index.ts'),
  `
export * from "./entity";
export * from "./repository"; // Internal use only across the package
`,
);

// Reservation Slice
fs.writeFileSync(
  path.join(srcDir, 'reservation/entity.ts'),
  `
export interface ReservationEntity {
  id: string;
  inventoryId: string;
  ownerType: string;
  ownerId: string;
  quantity: number;
  status: "PENDING" | "CONSUMED" | "RELEASED" | "EXPIRED";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'reservation/dto.ts'),
  `
import { z } from "zod";
import { reservationValidator } from "./validators";

export type CreateReservationDTO = z.infer<typeof reservationValidator.create>;
export type ReservationResponseDTO = z.infer<typeof reservationValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'reservation/validators.ts'),
  `
import { z } from "zod";

export const reservationValidator = {
  create: z.object({
    variantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    ownerType: z.string().min(1),
    ownerId: z.string().min(1),
    quantity: z.number().int().positive(),
    ttlSeconds: z.number().int().positive().default(900), // 15 mins default
  }),
  response: z.object({
    id: z.string().uuid(),
    inventoryId: z.string().uuid(),
    ownerType: z.string(),
    ownerId: z.string(),
    quantity: z.number(),
    status: z.enum(["PENDING", "CONSUMED", "RELEASED", "EXPIRED"]),
    expiresAt: z.date(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'reservation/mapper.ts'),
  `
import type { ReservationEntity } from "./entity";
import type { ReservationResponseDTO } from "./dto";

export function toReservationResponse(entity: ReservationEntity): ReservationResponseDTO {
  return {
    id: entity.id,
    inventoryId: entity.inventoryId,
    ownerType: entity.ownerType,
    ownerId: entity.ownerId,
    quantity: entity.quantity,
    status: entity.status,
    expiresAt: entity.expiresAt,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'reservation/repository.ts'),
  `
import { db, reservations } from "@kirana/database";
import type { ReservationEntity } from "./entity";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "@kirana/database/src/schema";

type Tx = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export class ReservationRepository {
  async create(tx: Tx, data: Omit<ReservationEntity, "id" | "status" | "createdAt" | "updatedAt">): Promise<ReservationEntity> {
    const [row] = await tx.insert(reservations).values(data).returning();
    return row as ReservationEntity;
  }
}
`,
);
fs.writeFileSync(
  path.join(srcDir, 'reservation/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export * from "./entity";
export * from "./repository"; // Internal use only
export * from "./mapper"; // Internal use only
`,
);

// Inventory Slice
fs.writeFileSync(
  path.join(srcDir, 'inventory/entity.ts'),
  `
export interface InventoryEntity {
  id: string;
  variantId: string;
  warehouseId: string;
  availableQuantity: number;
  reservedQuantity: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'inventory/dto.ts'),
  `
import { z } from "zod";
import { inventoryValidator } from "./validators";

export type ReceiveStockDTO = z.infer<typeof inventoryValidator.receive>;
export type InventoryResponseDTO = z.infer<typeof inventoryValidator.response>;
`,
);

fs.writeFileSync(
  path.join(srcDir, 'inventory/validators.ts'),
  `
import { z } from "zod";

export const inventoryValidator = {
  receive: z.object({
    variantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    quantity: z.number().int().positive(),
  }),
  response: z.object({
    id: z.string().uuid(),
    variantId: z.string().uuid(),
    warehouseId: z.string().uuid(),
    availableQuantity: z.number().int(),
    reservedQuantity: z.number().int(),
    version: z.number().int(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
};
`,
);

fs.writeFileSync(
  path.join(srcDir, 'inventory/mapper.ts'),
  `
import type { InventoryEntity } from "./entity";
import type { InventoryResponseDTO } from "./dto";

export function toInventoryResponse(entity: InventoryEntity): InventoryResponseDTO {
  return {
    id: entity.id,
    variantId: entity.variantId,
    warehouseId: entity.warehouseId,
    availableQuantity: entity.availableQuantity,
    reservedQuantity: entity.reservedQuantity,
    version: entity.version,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'inventory/repository.ts'),
  `
import { db, inventory } from "@kirana/database";
import { eq, and, asc } from "drizzle-orm";
import type { InventoryEntity } from "./entity";
import type { PgTransaction } from "drizzle-orm/pg-core";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import type { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import * as schema from "@kirana/database/src/schema";

type Tx = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;

export class InventoryRepository {
  async getOrCreate(tx: Tx, variantId: string, warehouseId: string): Promise<InventoryEntity> {
    const existing = await this.findByVariantAndWarehouseForUpdate(tx, variantId, warehouseId);
    if (existing) return existing;
    
    // Create if not exists. Concurrency here can be handled with ON CONFLICT DO NOTHING / Retry,
    // but simplifying for the example
    const [row] = await tx.insert(inventory).values({ variantId, warehouseId }).returning();
    return row as InventoryEntity;
  }
  
  async findByVariantAndWarehouseForUpdate(tx: Tx, variantId: string, warehouseId: string): Promise<InventoryEntity | null> {
    const [row] = await tx.select()
      .from(inventory)
      .where(and(eq(inventory.variantId, variantId), eq(inventory.warehouseId, warehouseId)))
      .for("update") // PESSIMISTIC LOCKING
      .limit(1);
    return (row as InventoryEntity) || null;
  }

  async updateQuantities(tx: Tx, id: string, availableDelta: number, reservedDelta: number): Promise<InventoryEntity> {
    const [row] = await tx.select().from(inventory).where(eq(inventory.id, id)).for("update");
    if (!row) throw new Error("Inventory not found");
    
    const newAvail = row.availableQuantity + availableDelta;
    const newRes = row.reservedQuantity + reservedDelta;
    
    if (newAvail < 0) throw new Error("Insufficient available stock");
    if (newRes < 0) throw new Error("Reserved stock cannot be negative");

    const [updated] = await tx.update(inventory)
      .set({ 
        availableQuantity: newAvail, 
        reservedQuantity: newRes,
        version: row.version + 1,
        updatedAt: new Date()
      })
      .where(eq(inventory.id, id))
      .returning();
      
    return updated as InventoryEntity;
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'inventory/service.ts'),
  `
import { db } from "@kirana/database";
import { InventoryRepository } from "./repository";
import { MovementRepository } from "../movement/repository";
import { ReservationRepository, toReservationResponse, reservationValidator } from "../reservation";
import { inventoryValidator } from "./validators";
import { toInventoryResponse } from "./mapper";
import type { ReceiveStockDTO, InventoryResponseDTO } from "./dto";
import type { CreateReservationDTO, ReservationResponseDTO } from "../reservation/dto";
// Import event definitions (no dispatching per constraints)
import type { InventoryReserved, InventoryReceived } from "../shared/events";

const inventoryRepo = new InventoryRepository();
const movementRepo = new MovementRepository();
const reservationRepo = new ReservationRepository();

export class InventoryService {
  
  async receiveStock(dto: ReceiveStockDTO): Promise<InventoryResponseDTO> {
    const validData = inventoryValidator.receive.parse(dto);
    
    // InventoryService owns the transaction boundary
    const result = await db.transaction(async (tx) => {
      // 1. Get/Lock inventory snapshot
      const inv = await inventoryRepo.getOrCreate(tx, validData.variantId, validData.warehouseId);
      
      // 2. Update snapshot
      const updatedInv = await inventoryRepo.updateQuantities(tx, inv.id, validData.quantity, 0);
      
      // 3. Immutable Movement Ledger
      await movementRepo.recordMovement(tx, {
        inventoryId: inv.id,
        type: "RECEIVED",
        quantity: validData.quantity,
        referenceId: null
      });
      
      return updatedInv;
    });
    
    return toInventoryResponse(result);
  }
  
  async reserveStock(dto: CreateReservationDTO): Promise<ReservationResponseDTO> {
    const validData = reservationValidator.create.parse(dto);
    
    const result = await db.transaction(async (tx) => {
      // 1. Get/Lock inventory snapshot (PESSIMISTIC LOCK)
      const inv = await inventoryRepo.getOrCreate(tx, validData.variantId, validData.warehouseId);
      
      // 2. Update snapshot (throws if insufficient stock)
      await inventoryRepo.updateQuantities(tx, inv.id, -validData.quantity, validData.quantity);
      
      // 3. Create Reservation
      const expiresAt = new Date(Date.now() + validData.ttlSeconds * 1000);
      const reservation = await reservationRepo.create(tx, {
        inventoryId: inv.id,
        ownerType: validData.ownerType,
        ownerId: validData.ownerId,
        quantity: validData.quantity,
        expiresAt
      });
      
      // 4. Immutable Movement Ledger
      await movementRepo.recordMovement(tx, {
        inventoryId: inv.id,
        type: "RESERVED",
        quantity: validData.quantity,
        referenceId: reservation.id
      });
      
      return reservation;
    });
    
    return toReservationResponse(result);
  }
}
`,
);

fs.writeFileSync(
  path.join(srcDir, 'inventory/index.ts'),
  `
export * from "./dto";
export * from "./validators";
export { InventoryService } from "./service";
`,
);

// Main Public API Barrel
fs.writeFileSync(
  path.join(srcDir, 'index.ts'),
  `
export * from "./inventory";
export * from "./warehouse";
export * from "./reservation/dto";
export * from "./reservation/validators";
export * from "./shared/events";
`,
);

console.log('Inventory workspace scaffolded.');
