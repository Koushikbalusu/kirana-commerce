import type { ProductEntity } from './entity';
import type { ProductResponseDTO } from './dto';

export function toProductResponse(entity: ProductEntity): ProductResponseDTO {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    description: entity.description,
    status: entity.status,
    categoryId: entity.categoryId,
    brandId: entity.brandId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    deletedAt: entity.deletedAt,
  };
}
