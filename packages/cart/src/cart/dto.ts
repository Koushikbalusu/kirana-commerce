import { z } from 'zod';
import { cartValidator } from './validators';
import type { CartSnapshot, CartValidationResult } from '../shared/types';

export type CartResponseDTO = z.infer<typeof cartValidator.response> & {
  snapshot?: CartSnapshot;
  validationResult?: CartValidationResult;
};
