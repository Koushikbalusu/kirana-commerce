import { PriceRepository } from './repository';
import { priceValidator } from './validators';
import { toPriceResponse } from './mapper';
import type { CreatePriceDTO, PriceResponseDTO } from './dto';

const repo = new PriceRepository();

export class PriceService {
  async createPrice(dto: CreatePriceDTO): Promise<PriceResponseDTO> {
    const validData = priceValidator.create.parse(dto);
    const entity = await repo.create({
      ...validData,
      startsAt: validData.startsAt || new Date(),
      endsAt: validData.endsAt || null,
      msrp: validData.msrp || null,
    });
    return toPriceResponse(entity);
  }

  async getActivePrice(variantId: string): Promise<PriceResponseDTO | null> {
    const entity = await repo.getActivePriceForVariant(variantId);
    return entity ? toPriceResponse(entity) : null;
  }
}
