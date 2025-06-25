import { ExpenseSubCategory } from '../models/expense-sub-category';

export interface ExpenseSubCategoryRepository {
  getAll(): Promise<ExpenseSubCategory[]>;
  getById(id: string): Promise<ExpenseSubCategory | null>;
  create(expenseSubCategory: ExpenseSubCategory): Promise<ExpenseSubCategory>;
  update(id: string, expenseSubCategory: Partial<ExpenseSubCategory>): Promise<ExpenseSubCategory>;
  delete(id: string): Promise<void>;
  getByParentCategoryId(parentCategoryId: string): Promise<ExpenseSubCategory[]>;
  searchByName(name: string): Promise<ExpenseSubCategory[]>;
  filterByActiveStatus(isActive: boolean): Promise<ExpenseSubCategory[]>;
}
