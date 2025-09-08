export interface Category {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  parentId?: number | null;
  parent?: {
    id: number;
    name: string;
  };
}
