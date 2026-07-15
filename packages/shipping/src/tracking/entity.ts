export interface TrackingEventEntity {
  id: string;
  attemptId: string;
  internalStatus: string;
  location: string | null;
  description: string | null;
  timestamp: Date;
  createdAt: Date;
}
