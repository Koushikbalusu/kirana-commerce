export interface ShipmentExceptionEntity {
  id: string;
  attemptId: string;
  exceptionType: string;
  description: string | null;
  createdAt: Date;
}
