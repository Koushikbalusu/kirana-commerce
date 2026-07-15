import { OrderRepository } from './repository';
import { toOrderResponse } from './mapper';
import type { OrderResponseDTO } from './dto';

const orderRepo = new OrderRepository();

export class OrderService {
  async getOrder(orderId: string): Promise<OrderResponseDTO> {
    const order = await orderRepo.getById(orderId);
    if (!order) throw new Error('Order not found');
    return toOrderResponse(order);
  }

  // Actually creating orders occurs inside the orchestration layer, but the repo supports it.

  async confirmPayment(orderId: string, paymentReference: string): Promise<OrderResponseDTO> {
    await orderRepo.updateFinancialStatus(orderId, 'PAID', 'Payment confirmed');
    // In a real system, you'd also save the payment reference here
    const updated = await orderRepo.getById(orderId);
    return toOrderResponse(updated!);
  }

  async cancelOrder(orderId: string, reason: string): Promise<OrderResponseDTO> {
    await orderRepo.updateFinancialStatus(orderId, 'REFUNDED', reason);
    const updated = await orderRepo.getById(orderId);
    return toOrderResponse(updated!);
  }
}
