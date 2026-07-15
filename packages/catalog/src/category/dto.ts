import { z } from 'zod';
import { categoryValidator } from './validators';

export type CreateCategoryDTO = z.infer<typeof categoryValidator.create>;
export type UpdateCategoryDTO = z.infer<typeof categoryValidator.update>;
export type CategoryResponseDTO = z.infer<typeof categoryValidator.response>;
