export interface WarehouseEntity {
  id: string;
  name: string;
  locationCode: string;
  type: 'STORE' | 'FULFILLMENT_CENTER' | 'DARK_STORE' | 'SUPPLIER' | 'TRANSIT';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
