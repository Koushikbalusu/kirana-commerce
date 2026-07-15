export interface InventoryEvent<T = any> {
  type: string;
  payload: T;
  timestamp: Date;
}

export type InventoryReserved = InventoryEvent<{
  inventoryId: string;
  quantity: number;
  ownerId: string;
}>;
export type InventoryReleased = InventoryEvent<{
  inventoryId: string;
  quantity: number;
  ownerId: string;
}>;
export type InventoryReceived = InventoryEvent<{ inventoryId: string; quantity: number }>;
export type InventoryAdjusted = InventoryEvent<{ inventoryId: string; quantityChange: number }>;
export type InventoryTransferred = InventoryEvent<{
  sourceInventoryId: string;
  destinationInventoryId: string;
  quantity: number;
}>;
export type InventoryReturned = InventoryEvent<{ inventoryId: string; quantity: number }>;
export type InventoryDamaged = InventoryEvent<{ inventoryId: string; quantity: number }>;
export type InventoryLost = InventoryEvent<{ inventoryId: string; quantity: number }>;
