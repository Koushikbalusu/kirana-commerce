import { ShipmentRepository } from './repository';
import { toShipmentResponse } from './mapper';
import type { ShipmentResponseDTO } from './dto';

const repo = new ShipmentRepository();

export class ShipmentService {
  async getShipment(id: string): Promise<ShipmentResponseDTO> {
    const shipment = await repo.getById(id);
    if (!shipment) throw new Error('Shipment not found');
    return toShipmentResponse(shipment);
  }

  async createShipment(payload: any): Promise<ShipmentResponseDTO> {
    throw new Error('Not implemented yet');
  }

  async dispatchShipment(id: string): Promise<ShipmentResponseDTO> {
    throw new Error('Not implemented yet');
  }

  async completeDelivery(id: string): Promise<ShipmentResponseDTO> {
    throw new Error('Not implemented yet');
  }
}
