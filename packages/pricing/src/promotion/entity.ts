export interface PromotionActionEntity {
  id: string;
  type: string;
  discountType: string;
  discountValue: number;
}
export interface PromotionEntity {
  id: string;
  name: string;
  priority: number;
  isActive: boolean;
  actions?: PromotionActionEntity[];
}
