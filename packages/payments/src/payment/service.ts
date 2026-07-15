import { PaymentRepository } from './repository';
import { toPaymentResponse } from './mapper';
import type { PaymentResponseDTO } from './dto';

const paymentRepo = new PaymentRepository();

export class PaymentService {
  async getPayment(id: string): Promise<PaymentResponseDTO> {
    const payment = await paymentRepo.getById(id);
    if (!payment) throw new Error('Payment not found');
    return toPaymentResponse(payment);
  }

  // Implementation of orchestration: create intent -> attempt -> payment
  // (Stubbed per architecture contract)
}
