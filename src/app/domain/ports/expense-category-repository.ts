import { ExpenseCategory } from '../models/expense-category';

export interface ExpenseCategoryRepository {
  getById(id: number): Promise<ExpenseCategory | null>;
  getAll(): Promise<ExpenseCategory[]>;
  create(
    category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExpenseCategory>;
  update(
    id: number,
    updates: Partial<Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ExpenseCategory | null>;
  delete(id: number): Promise<boolean>;
  searchByName(name: string): Promise<ExpenseCategory[]>;
  filterByActiveStatus(isActive: boolean): Promise<ExpenseCategory[]>;
}
