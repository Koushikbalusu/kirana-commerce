import { WarehouseRepository } from './repository';
import { warehouseValidator } from './validators';
import { toWarehouseResponse } from './mapper';
import type { CreateWarehouseDTO, WarehouseResponseDTO } from './dto';

const repo = new WarehouseRepository();

export class WarehouseService {
  async createWarehouse(dto: CreateWarehouseDTO): Promise<WarehouseResponseDTO> {
    const validData = warehouseValidator.create.parse(dto);
    const entity = await repo.create(validData);
    return toWarehouseResponse(entity);
  }
}
