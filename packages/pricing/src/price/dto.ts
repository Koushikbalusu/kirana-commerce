import { z } from 'zod';
import { priceValidator } from './validators';

export type CreatePriceDTO = z.infer<typeof priceValidator.create>;
export type PriceResponseDTO = z.infer<typeof priceValidator.response>;
