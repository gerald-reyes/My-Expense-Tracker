import { Observable } from 'rxjs';
import { Category } from '../../features/categories/data-access/models/category.model';

export interface ExpenseCategoryRepository {
  getById(id: number): Observable<Category | undefined>;
  getAll(): Observable<Category[]>;
  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Observable<Category>;
  update(
    id: number,
    updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Observable<Category>;
  delete(id: number): Observable<boolean>;
  searchByName(name: string): Observable<Category[]>;
  filterByActiveStatus(isActive: boolean): Observable<Category[]>;
}
