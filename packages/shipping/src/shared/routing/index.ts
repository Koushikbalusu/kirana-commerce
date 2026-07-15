export interface RoutingStrategy {
  selectCarrier(originWarehouseId: string, destinationAddress: any): Promise<string>;
}
// Future strategies: NearestWarehouse, CheapestCarrier, FastestCarrier, BusinessRules
