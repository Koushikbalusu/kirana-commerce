import type { CartEntity } from './entity';
import type { CartResponseDTO } from './dto';
import { toCartItemResponse } from '../cart-item/mapper';

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
