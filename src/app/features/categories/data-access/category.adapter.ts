import { CategoryDto } from '../data-access/models/category.dto';
import { Category } from '../data-access/models/category.model';

export const toCategory = (dto: CategoryDto): Category => ({
  id: dto.id,
  name: dto.name,
  description: dto.description,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  isActive: dto.isActive,
});

export const toCategoryDto = (m: Category): CategoryDto => ({
  id: m.id,
  name: m.name,
  description: m.description,
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
  isActive: m.isActive,
});
