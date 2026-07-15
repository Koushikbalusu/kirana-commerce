import type { WarehouseEntity } from './entity';
import type { WarehouseResponseDTO } from './dto';

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
