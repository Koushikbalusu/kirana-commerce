import type { CartItemEntity } from './entity';

export function toCartItemResponse(entity: CartItemEntity) {
  return {
    id: entity.id,
    cartId: entity.cartId,
    variantId: entity.variantId,
    quantity: entity.quantity,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
