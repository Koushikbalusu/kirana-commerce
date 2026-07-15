export interface ShippingLabelEntity {
  id: string;
  attemptId: string;
  format: 'PDF' | 'PNG' | 'ZPL';
  url: string;
  createdAt: Date;
}
