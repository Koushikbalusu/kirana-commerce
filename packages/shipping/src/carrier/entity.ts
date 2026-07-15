export interface CarrierEntity {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
}

export interface CarrierConfigurationEntity {
  id: string;
  carrierId: string;
  environment: string;
  isActive: boolean;
  apiKeysReference: string;
  createdAt: Date;
}
