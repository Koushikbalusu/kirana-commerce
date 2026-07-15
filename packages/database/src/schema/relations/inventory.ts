import { relations } from 'drizzle-orm';
import { productVariants } from '../tables/product_variants';
import { warehouses } from '../tables/warehouses';
import { inventory } from '../tables/inventory';
import { reservations } from '../tables/reservations';
import { inventoryMovements } from '../tables/inventory_movements';
import { stockAdjustments } from '../tables/stock_adjustments';
import { transfers } from '../tables/transfers';

export const warehouseRelations = relations(warehouses, ({ many }) => ({
  inventory: many(inventory),
}));

export const inventoryRelations = relations(inventory, ({ one, many }) => ({
  variant: one(productVariants, {
    fields: [inventory.variantId],
    references: [productVariants.id],
  }),
  warehouse: one(warehouses, {
    fields: [inventory.warehouseId],
    references: [warehouses.id],
  }),
  reservations: many(reservations),
  movements: many(inventoryMovements),
  adjustments: many(stockAdjustments),
}));

export const reservationRelations = relations(reservations, ({ one }) => ({
  inventory: one(inventory, {
    fields: [reservations.inventoryId],
    references: [inventory.id],
  }),
}));

export const inventoryMovementRelations = relations(inventoryMovements, ({ one }) => ({
  inventory: one(inventory, {
    fields: [inventoryMovements.inventoryId],
    references: [inventory.id],
  }),
}));

export const stockAdjustmentRelations = relations(stockAdjustments, ({ one }) => ({
  inventory: one(inventory, {
    fields: [stockAdjustments.inventoryId],
    references: [inventory.id],
  }),
}));

export const transferRelations = relations(transfers, ({ one }) => ({
  sourceWarehouse: one(warehouses, {
    fields: [transfers.sourceWarehouseId],
    references: [warehouses.id],
    relationName: 'source_warehouse_transfers',
  }),
  destinationWarehouse: one(warehouses, {
    fields: [transfers.destinationWarehouseId],
    references: [warehouses.id],
    relationName: 'destination_warehouse_transfers',
  }),
  variant: one(productVariants, {
    fields: [transfers.variantId],
    references: [productVariants.id],
  }),
}));
