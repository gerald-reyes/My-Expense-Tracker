import { Observable } from 'rxjs';
import { SubCategory } from '../../features/categories/data-access/models/sub-category.model';

export interface ExpenseSubCategoryRepository {
  getAll(): Observable<SubCategory[]>;
  getById(id: string): Observable<SubCategory>;
  create(expenseSubCategory: SubCategory): Observable<SubCategory>;
  update(id: string, expenseSubCategory: Partial<SubCategory>): Observable<SubCategory>;
  delete(id: string): Observable<boolean>;
  getByParentCategoryId(parentCategoryId: string): Observable<SubCategory[]>;
  searchByName(name: string): Observable<SubCategory[]>;
  filterByActiveStatus(isActive: boolean): Observable<SubCategory[]>;
}
