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
