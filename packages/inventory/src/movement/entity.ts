export interface MovementEntity {
  id: string;
  inventoryId: string;
  type:
    | 'RECEIVED'
    | 'SHIPPED'
    | 'RESERVED'
    | 'RELEASED'
    | 'TRANSFER_IN'
    | 'TRANSFER_OUT'
    | 'RETURNED'
    | 'DAMAGED'
    | 'LOST'
    | 'ADJUSTED';
  quantity: number;
  referenceId: string | null;
  createdAt: Date;
}
