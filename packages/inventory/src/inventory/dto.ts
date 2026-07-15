import { z } from 'zod';
import { inventoryValidator } from './validators';

export type ReceiveStockDTO = z.infer<typeof inventoryValidator.receive>;
export type InventoryResponseDTO = z.infer<typeof inventoryValidator.response>;
