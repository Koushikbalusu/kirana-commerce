import { ProductRepository } from './repository';
import { productValidator } from './validators';
import { generateSlug } from '../shared/slug';
import { toProductResponse } from './mapper';
import type { CreateProductDTO, ProductResponseDTO } from './dto';
// Import event definitions (no dispatching per constraints)
import type {
  ProductCreated,
  ProductPublished,
  ProductArchived,
  ProductDeleted,
} from '../shared/events';

const repo = new ProductRepository();

export class ProductService {
  async createProduct(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    const validData = productValidator.create.parse(dto);
    const slug = generateSlug(validData.name);

    const entity = await repo.create({
      name: validData.name,
      slug,
      description: validData.description || null,
      status: 'DRAFT',
      categoryId: validData.categoryId,
      brandId: validData.brandId || null,
    });

    // Future: dispatch ProductCreated event

    return toProductResponse(entity);
  }

  async publishProduct(id: string): Promise<ProductResponseDTO> {
    // Note: Would typically ensure required relations (images, variants) exist first
    const entity = await repo.updateStatus(id, 'PUBLISHED');
    // Future: dispatch ProductPublished event
    return toProductResponse(entity);
  }

  async archiveProduct(id: string): Promise<ProductResponseDTO> {
    const entity = await repo.updateStatus(id, 'ARCHIVED');
    // Future: dispatch ProductArchived event
    return toProductResponse(entity);
  }

  async deleteProduct(id: string): Promise<void> {
    await repo.softDelete(id);
    // Future: dispatch ProductDeleted event
  }
}
