export interface CartSessionEntity {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}
