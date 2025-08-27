export interface SubCategory {
  id: number;
  name: string;
  description?: string | null;
  parentCategoryId: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isRecurring: boolean;
}
