import type { PriceEntity } from './entity';
import type { PriceResponseDTO } from './dto';

export function toPriceResponse(entity: PriceEntity): PriceResponseDTO {
  return {
    id: entity.id,
    variantId: entity.variantId,
    currencyId: entity.currencyId,
    amount: entity.amount,
    msrp: entity.msrp,
    startsAt: entity.startsAt,
    endsAt: entity.endsAt,
  };
}
