import { pgEnum } from 'drizzle-orm/pg-core';

export const warehouseTypeEnum = pgEnum('warehouse_type', [
  'STORE',
  'FULFILLMENT_CENTER',
  'DARK_STORE',
  'SUPPLIER',
  'TRANSIT',
]);

export const inventoryMovementTypeEnum = pgEnum('inventory_movement_type', [
  'RECEIVED',
  'SHIPPED',
  'RESERVED',
  'RELEASED',
  'TRANSFER_IN',
  'TRANSFER_OUT',
  'RETURNED',
  'DAMAGED',
  'LOST',
  'ADJUSTED',
]);

export const reservationStatusEnum = pgEnum('reservation_status', [
  'PENDING',
  'CONSUMED',
  'RELEASED',
  'EXPIRED',
]);

export const stockAdjustmentCategoryEnum = pgEnum('stock_adjustment_category', [
  'INITIAL_STOCK',
  'CYCLE_COUNT',
  'MANUAL_ADJUSTMENT',
  'CORRECTION',
]);

export const transferStatusEnum = pgEnum('transfer_status', [
  'PENDING',
  'IN_TRANSIT',
  'COMPLETED',
  'CANCELLED',
]);
