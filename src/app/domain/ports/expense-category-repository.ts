import { Observable } from 'rxjs';
import { ExpenseCategory } from '../models/expense-category';

export interface ExpenseCategoryRepository {
  getById(id: number): Observable<ExpenseCategory | undefined>;
  getAll(): Observable<ExpenseCategory[]>;
  create(
    category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Observable<ExpenseCategory>;
  update(
    id: number,
    updates: Partial<Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Observable<ExpenseCategory>;
  delete(id: number): Observable<boolean>;
  searchByName(name: string): Observable<ExpenseCategory[]>;
  filterByActiveStatus(isActive: boolean): Observable<ExpenseCategory[]>;
}
