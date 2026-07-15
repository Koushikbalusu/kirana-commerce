import type { PaymentEntity } from './entity';
import type { PaymentResponseDTO } from './dto';

export function toPaymentResponse(entity: PaymentEntity): PaymentResponseDTO {
  return { ...entity };
}
