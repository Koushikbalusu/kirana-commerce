import { z } from 'zod';
import { productValidator } from './validators';

export type CreateProductDTO = z.infer<typeof productValidator.create>;
export type UpdateProductDTO = z.infer<typeof productValidator.update>;
export type ProductResponseDTO = z.infer<typeof productValidator.response>;
