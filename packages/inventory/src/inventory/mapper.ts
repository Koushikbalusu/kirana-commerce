import type { InventoryEntity } from './entity';
import type { InventoryResponseDTO } from './dto';

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
