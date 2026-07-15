import type { ShipmentEntity } from './entity';
import type { ShipmentResponseDTO } from './dto';

export function toShipmentResponse(entity: ShipmentEntity): ShipmentResponseDTO {
  return { ...entity };
}
