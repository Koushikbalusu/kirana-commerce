export interface ReservationEntity {
  id: string;
  inventoryId: string;
  ownerType: string;
  ownerId: string;
  quantity: number;
  status: 'PENDING' | 'CONSUMED' | 'RELEASED' | 'EXPIRED';
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
