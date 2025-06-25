import { inject, Injectable } from '@angular/core';
import { ExpenseCategory } from '../../domain/models/expense-category';
import { ExpenseCategoryRepository } from '../../domain/ports/expense-category-repository';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCategoryApi implements ExpenseCategoryRepository {
  private readonly gqlService = inject(GraphQLService);

  private readonly queries = {
    getById: gql`
      query ($id: Int!) {
        expenseCategory(id: $id) {
          id
          name
          description
          createdAt
          updatedAt
          isActive
        }
      }
    `,
    getAll: gql`
      query {
        expenseCategories {
          id
          name
          description
          createdAt
          updatedAt
          isActive
        }
      }
    `,
    searchByName: gql`
      query ($name: String!) {
        searchExpenseCategories(name: $name) {
          id
          name
          description
          createdAt
          updatedAt
          isActive
        }
      }
    `,
    filterByActiveStatus: gql`
      query ($isActive: Boolean!) {
        filterExpenseCategories(isActive: $isActive) {
          id
          name
          description
          createdAt
          updatedAt
          isActive
        }
      }
    `,
  };

  private readonly mutations = {
    create: gql`
      mutation ($input: CreateExpenseCategoryInput!) {
        createExpenseCategory(input: $input) {
          id
          name
          description
          createdAt
          updatedAt
          isActive
        }
      }
    `,
    update: gql`
      mutation ($id: Int!, $updates: UpdateExpenseCategoryInput!) {
        updateExpenseCategory(id: $id, updates: $updates) {
          id
          name
          description
          createdAt
          updatedAt
          isActive
        }
      }
    `,
    delete: gql`
      mutation ($id: Int!) {
        deleteExpenseCategory(id: $id)
      }
    `,
  };

  async getById(id: number): Promise<ExpenseCategory | null> {
    return this.gqlService.runQuery<{
      expenseCategory: ExpenseCategory | null;
    }>(this.queries.getById, { id }, 'expenseCategory');
  }

  async getAll(): Promise<ExpenseCategory[]> {
    return this.gqlService.runQuery<{ expenseCategories: ExpenseCategory[] }>(
      this.queries.getAll,
      {},
      'expenseCategories',
    );
  }

  async create(
    category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ExpenseCategory> {
    return this.gqlService.runMutation<{
      createExpenseCategory: ExpenseCategory;
    }>(this.mutations.create, { input: category }, 'createExpenseCategory');
  }

  async update(
    id: number,
    updates: Partial<Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<ExpenseCategory | null> {
    return this.gqlService.runMutation<{
      updateExpenseCategory: ExpenseCategory | null;
    }>(this.mutations.update, { id, updates }, 'updateExpenseCategory');
  }

  async delete(id: number): Promise<boolean> {
    return this.gqlService.runMutation<{ deleteExpenseCategory: boolean }>(
      this.mutations.delete,
      { id },
      'deleteExpenseCategory',
    );
  }

  async searchByName(name: string): Promise<ExpenseCategory[]> {
    return this.gqlService.runQuery<{
      searchExpenseCategories: ExpenseCategory[];
    }>(this.queries.searchByName, { name }, 'searchExpenseCategories');
  }

  async filterByActiveStatus(isActive: boolean): Promise<ExpenseCategory[]> {
    return this.gqlService.runQuery<{
      filterExpenseCategories: ExpenseCategory[];
    }>(this.queries.filterByActiveStatus, { isActive }, 'filterExpenseCategories');
  }
}
