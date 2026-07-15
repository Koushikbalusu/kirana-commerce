export interface CarrierWebhookEntity {
  id: string;
  carrierId: string;
  eventType: string;
  payload: any;
  status: string;
  processedAt: Date | null;
  createdAt: Date;
}
