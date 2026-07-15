import type { ReservationEntity } from './entity';
import type { ReservationResponseDTO } from './dto';

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
