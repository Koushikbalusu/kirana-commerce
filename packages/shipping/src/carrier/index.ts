export interface CarrierAdapter {
  createShipment(payload: any): Promise<any>;
  generateLabel(attemptId: string): Promise<any>;
  schedulePickup(attemptId: string): Promise<any>;
  cancelShipment(attemptId: string): Promise<any>;
  trackShipment(attemptId: string): Promise<any>;
  validateAddress(address: any): Promise<boolean>;
}
// Carrier, CarrierConfiguration entities, repos, services
export * from './entity';
