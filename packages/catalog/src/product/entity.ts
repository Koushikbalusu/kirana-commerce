export interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';
  categoryId: string;
  brandId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
