import { inject, Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { ExpenseSubCategory } from '../../domain/models/expense-sub-category';
import { ExpenseSubCategoryRepository } from '../../domain/ports/expense-sub-category-repository';
import { GraphQLService } from '../shared/graphql/graphql.service';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class ExpenseSubCategoryApi implements ExpenseSubCategoryRepository {
  private readonly gqlService = inject(GraphQLService);

  private readonly FIELDS = `
    id
    name
    isActive
    parentCategoryId
    createdAt
    updatedAt
  `;

  private readonly queries = {
    getAll: gql`
      query {
        expenseSubCategories {
          ${this.FIELDS}
        }
      }
    `,
    getById: gql`
      query ($id: ID!) {
        expenseSubCategory(id: $id) {
          ${this.FIELDS}
        }
      }
    `,
    getByParentCategoryId: gql`
      query ($parentCategoryId: ID!) {
        expenseSubCategoriesByParent(parentCategoryId: $parentCategoryId) {
          ${this.FIELDS}
        }
      }
    `,
    searchByName: gql`
      query ($name: String!) {
        expenseSubCategoriesByName(name: $name) {
          ${this.FIELDS}
        }
      }
    `,
    filterByActiveStatus: gql`
      query ($isActive: Boolean!) {
        expenseSubCategoriesByActiveStatus(isActive: $isActive) {
          ${this.FIELDS}
        }
      }
    `,
  };

  private readonly mutations = {
    create: gql`
      mutation ($input: CreateExpenseSubCategoryInput!) {
        createExpenseSubCategory(input: $input) {
          ${this.FIELDS}
        }
      }
    `,
    update: gql`
      mutation ($id: ID!, $input: UpdateExpenseSubCategoryInput!) {
        updateExpenseSubCategory(id: $id, input: $input) {
          ${this.FIELDS}
        }
      }
    `,
    delete: gql`
      mutation ($id: ID!) {
        deleteExpenseSubCategory(id: $id)
      }
    `,
  };

  getAll() {
    return this.gqlService
      .runQuery<{
        expenseSubCategories: ExpenseSubCategory[];
      }>(this.queries.getAll, {}, 'expenseSubCategories')
      .pipe(map((subCategories) => subCategories || []));
  }

  getById(id: string) {
    return this.gqlService
      .runQuery<{
        expenseSubCategory: ExpenseSubCategory | null;
      }>(this.queries.getById, { id }, 'expenseSubCategory')
      .pipe(
        map((subCategory) => {
          if (!subCategory) {
            throw new Error(`Expense sub-category with id ${id} not found`);
          }
          return subCategory;
        }),
      );
  }

  create(sub: ExpenseSubCategory) {
    return this.gqlService
      .runMutation<{
        createExpenseSubCategory: ExpenseSubCategory;
      }>(this.mutations.create, { input: sub }, 'createExpenseSubCategory')
      .pipe(
        map((result) => {
          if (!result) {
            throw new Error('Failed to create expense sub-category');
          }
          return result;
        }),
      );
  }

  update(id: string, patch: Partial<ExpenseSubCategory>) {
    return this.gqlService
      .runMutation<{
        updateExpenseSubCategory: ExpenseSubCategory;
      }>(this.mutations.update, { id, input: patch }, 'updateExpenseSubCategory')
      .pipe(
        map((result) => {
          if (!result) {
            throw new Error(`Failed to update expense sub-category with id ${id}`);
          }
          return result;
        }),
      );
  }

  delete(id: string) {
    return this.gqlService
      .runMutation<{
        deleteExpenseSubCategory: boolean;
      }>(this.mutations.delete, { id }, 'deleteExpenseSubCategory')
      .pipe(
        map((result) => {
          if (result === undefined) {
            throw new Error(`Failed to delete expense sub-category with id ${id}`);
          }
          return result;
        }),
      );
  }

  getByParentCategoryId(parentCategoryId: string) {
    return this.gqlService
      .runQuery<{
        expenseSubCategoriesByParent: ExpenseSubCategory[];
      }>(this.queries.getByParentCategoryId, { parentCategoryId }, 'expenseSubCategoriesByParent')
      .pipe(map((subCategories) => subCategories || []));
  }

  searchByName(name: string) {
    return this.gqlService
      .runQuery<{
        expenseSubCategoriesByName: ExpenseSubCategory[];
      }>(this.queries.searchByName, { name }, 'expenseSubCategoriesByName')
      .pipe(map((subCategories) => subCategories || []));
  }

  filterByActiveStatus(isActive: boolean) {
    return this.gqlService
      .runQuery<{
        expenseSubCategoriesByActiveStatus: ExpenseSubCategory[];
      }>(this.queries.filterByActiveStatus, { isActive }, 'expenseSubCategoriesByActiveStatus')
      .pipe(map((subCategories) => subCategories || []));
  }
}
