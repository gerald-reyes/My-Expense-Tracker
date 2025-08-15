import { inject, Injectable } from '@angular/core';
import { ExpenseCategory } from '../../domain/models/expense-category';
import { ExpenseCategoryRepository } from '../../domain/ports/expense-category-repository';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable()
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

  getById(id: number) {
    return this.gqlService
      .runQuery<{
        expenseCategory: ExpenseCategory | undefined;
      }>(this.queries.getById, { id }, 'expenseCategory')
      .pipe(
        map((category) => {
          if (!category) {
            throw new Error(`Expense category with id ${id} not found`);
          }
          return category;
        }),
      );
  }

  getAll() {
    return this.gqlService
      .runQuery<{
        expenseCategories: ExpenseCategory[];
      }>(this.queries.getAll, {}, 'expenseCategories')
      .pipe(map((categories) => categories || []));
  }

  create(category: Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.gqlService
      .runMutation<{
        createExpenseCategory: ExpenseCategory | undefined;
      }>(this.mutations.create, { input: category }, 'createExpenseCategory')
      .pipe(
        map((result) => {
          if (!result) {
            throw new Error('Failed to create expense category');
          }
          return result;
        }),
      );
  }

  update(id: number, updates: Partial<Omit<ExpenseCategory, 'id' | 'createdAt' | 'updatedAt'>>) {
    return this.gqlService
      .runMutation<{
        updateExpenseCategory: ExpenseCategory | null | undefined;
      }>(this.mutations.update, { id, updates }, 'updateExpenseCategory')
      .pipe(
        map((result) => {
          if (!result) {
            throw new Error(`Failed to update expense category with id ${id}`);
          }
          return result;
        }),
      );
  }

  delete(id: number) {
    return this.gqlService
      .runMutation<{
        deleteExpenseCategory: boolean | undefined;
      }>(this.mutations.delete, { id }, 'deleteExpenseCategory')
      .pipe(
        map((result) => {
          if (result === undefined) {
            throw new Error(`Failed to delete expense category with id ${id}`);
          }
          return result;
        }),
      );
  }

  searchByName(name: string) {
    return this.gqlService
      .runQuery<{
        searchExpenseCategories: ExpenseCategory[];
      }>(this.queries.searchByName, { name }, 'searchExpenseCategories')
      .pipe(map((categories) => categories || []));
  }

  filterByActiveStatus(isActive: boolean) {
    return this.gqlService
      .runQuery<{
        filterExpenseCategories: ExpenseCategory[];
      }>(this.queries.filterByActiveStatus, { isActive }, 'filterExpenseCategories')
      .pipe(map((categories) => categories || []));
  }
}
