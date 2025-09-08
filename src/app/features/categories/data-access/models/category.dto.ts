export interface CategoryDto {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  parentId?: number | null;
}
