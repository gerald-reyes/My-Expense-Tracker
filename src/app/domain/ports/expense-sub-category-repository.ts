import { Observable } from 'rxjs';
import { ExpenseSubCategory } from '../models/expense-sub-category';

export interface ExpenseSubCategoryRepository {
  getAll(): Observable<ExpenseSubCategory[]>;
  getById(id: string): Observable<ExpenseSubCategory>;
  create(expenseSubCategory: ExpenseSubCategory): Observable<ExpenseSubCategory>;
  update(
    id: string,
    expenseSubCategory: Partial<ExpenseSubCategory>,
  ): Observable<ExpenseSubCategory>;
  delete(id: string): Observable<boolean>;
  getByParentCategoryId(parentCategoryId: string): Observable<ExpenseSubCategory[]>;
  searchByName(name: string): Observable<ExpenseSubCategory[]>;
  filterByActiveStatus(isActive: boolean): Observable<ExpenseSubCategory[]>;
}
