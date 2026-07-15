import type { CategoryEntity } from './entity';
import type { CategoryResponseDTO } from './dto';

export function toCategoryResponse(entity: CategoryEntity): CategoryResponseDTO {
  return {
    id: entity.id,
    name: entity.name,
    slug: entity.slug,
    parentId: entity.parentId,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
