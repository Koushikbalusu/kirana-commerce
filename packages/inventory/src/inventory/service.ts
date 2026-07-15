import { db } from '@kirana/database';
import { InventoryRepository } from './repository';
import { MovementRepository } from '../movement/repository';
import { ReservationRepository, toReservationResponse, reservationValidator } from '../reservation';
import { inventoryValidator } from './validators';
import { toInventoryResponse } from './mapper';
import type { ReceiveStockDTO, InventoryResponseDTO } from './dto';
import type { CreateReservationDTO, ReservationResponseDTO } from '../reservation/dto';
// Import event definitions (no dispatching per constraints)
import type { InventoryReserved, InventoryReceived } from '../shared/events';

const inventoryRepo = new InventoryRepository();
const movementRepo = new MovementRepository();
const reservationRepo = new ReservationRepository();

export class InventoryService {
  async receiveStock(dto: ReceiveStockDTO): Promise<InventoryResponseDTO> {
    const validData = inventoryValidator.receive.parse(dto);

    // InventoryService owns the transaction boundary
    const result = await db.transaction(async (tx) => {
      // 1. Get/Lock inventory snapshot
      const inv = await inventoryRepo.getOrCreate(tx, validData.variantId, validData.warehouseId);

      // 2. Update snapshot
      const updatedInv = await inventoryRepo.updateQuantities(tx, inv.id, validData.quantity, 0);

      // 3. Immutable Movement Ledger
      await movementRepo.recordMovement(tx, {
        inventoryId: inv.id,
        type: 'RECEIVED',
        quantity: validData.quantity,
        referenceId: null,
      });

      return updatedInv;
    });

    return toInventoryResponse(result);
  }

  async reserveStock(dto: CreateReservationDTO): Promise<ReservationResponseDTO> {
    const validData = reservationValidator.create.parse(dto);

    const result = await db.transaction(async (tx) => {
      // 1. Get/Lock inventory snapshot (PESSIMISTIC LOCK)
      const inv = await inventoryRepo.getOrCreate(tx, validData.variantId, validData.warehouseId);

      // 2. Update snapshot (throws if insufficient stock)
      await inventoryRepo.updateQuantities(tx, inv.id, -validData.quantity, validData.quantity);

      // 3. Create Reservation
      const expiresAt = new Date(Date.now() + validData.ttlSeconds * 1000);
      const reservation = await reservationRepo.create(tx, {
        inventoryId: inv.id,
        ownerType: validData.ownerType,
        ownerId: validData.ownerId,
        quantity: validData.quantity,
        expiresAt,
      });

      // 4. Immutable Movement Ledger
      await movementRepo.recordMovement(tx, {
        inventoryId: inv.id,
        type: 'RESERVED',
        quantity: validData.quantity,
        referenceId: reservation.id,
      });

      return reservation;
    });

    return toReservationResponse(result);
  }
}
