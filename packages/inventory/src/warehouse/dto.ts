import { z } from 'zod';
import { warehouseValidator } from './validators';

export type CreateWarehouseDTO = z.infer<typeof warehouseValidator.create>;
export type WarehouseResponseDTO = z.infer<typeof warehouseValidator.response>;
