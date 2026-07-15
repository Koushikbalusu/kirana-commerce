export interface WebhookEventEntity {
  id: string;
  providerId: string;
  eventType: string;
  payload: any;
  status: 'RECEIVED' | 'VALIDATED' | 'PROCESSED' | 'FAILED';
  processedAt: Date | null;
  createdAt: Date;
}
