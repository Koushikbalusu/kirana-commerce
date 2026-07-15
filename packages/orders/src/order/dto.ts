import { z } from 'zod';
import { orderValidator } from './validators';

export type OrderResponseDTO = z.infer<typeof orderValidator.response>;
