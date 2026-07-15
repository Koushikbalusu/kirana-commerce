import { CategoryRepository } from './repository';
import { categoryValidator } from './validators';
import { generateSlug } from '../shared/slug';
import { toCategoryResponse } from './mapper';
import type { CreateCategoryDTO, CategoryResponseDTO } from './dto';

const repo = new CategoryRepository();

export class CategoryService {
  async createCategory(dto: CreateCategoryDTO): Promise<CategoryResponseDTO> {
    const validData = categoryValidator.create.parse(dto);
    const slug = generateSlug(validData.name);

    const entity = await repo.create({
      name: validData.name,
      slug,
      parentId: validData.parentId || null,
    });

    return toCategoryResponse(entity);
  }
}
