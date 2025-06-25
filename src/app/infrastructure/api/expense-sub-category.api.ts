import { inject, Injectable } from '@angular/core';
import { gql } from 'apollo-angular';
import { ExpenseSubCategory } from '../../domain/models/expense-sub-category';
import { ExpenseSubCategoryRepository } from '../../domain/ports/expense-sub-category-repository';
import { GraphQLService } from '../shared/graphql/graphql.service';

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

  async getAll(): Promise<ExpenseSubCategory[]> {
    return this.gqlService.runQuery<{
      expenseSubCategories: ExpenseSubCategory[];
    }>(this.queries.getAll, {}, 'expenseSubCategories');
  }

  async getById(id: string): Promise<ExpenseSubCategory | null> {
    return this.gqlService.runQuery<{
      expenseSubCategory: ExpenseSubCategory | null;
    }>(this.queries.getById, { id }, 'expenseSubCategory');
  }

  async create(sub: ExpenseSubCategory): Promise<ExpenseSubCategory> {
    return this.gqlService.runMutation<{
      createExpenseSubCategory: ExpenseSubCategory;
    }>(this.mutations.create, { input: sub }, 'createExpenseSubCategory');
  }

  async update(id: string, patch: Partial<ExpenseSubCategory>): Promise<ExpenseSubCategory> {
    return this.gqlService.runMutation<{
      updateExpenseSubCategory: ExpenseSubCategory;
    }>(this.mutations.update, { id, input: patch }, 'updateExpenseSubCategory');
  }

  async delete(id: string): Promise<void> {
    await this.gqlService.runMutation<{ deleteExpenseSubCategory: boolean }>(
      this.mutations.delete,
      { id },
      'deleteExpenseSubCategory',
    );
  }

  async getByParentCategoryId(parentCategoryId: string): Promise<ExpenseSubCategory[]> {
    return this.gqlService.runQuery<{
      expenseSubCategoriesByParent: ExpenseSubCategory[];
    }>(this.queries.getByParentCategoryId, { parentCategoryId }, 'expenseSubCategoriesByParent');
  }

  async searchByName(name: string): Promise<ExpenseSubCategory[]> {
    return this.gqlService.runQuery<{
      expenseSubCategoriesByName: ExpenseSubCategory[];
    }>(this.queries.searchByName, { name }, 'expenseSubCategoriesByName');
  }

  async filterByActiveStatus(isActive: boolean): Promise<ExpenseSubCategory[]> {
    return this.gqlService.runQuery<{
      expenseSubCategoriesByActiveStatus: ExpenseSubCategory[];
    }>(this.queries.filterByActiveStatus, { isActive }, 'expenseSubCategoriesByActiveStatus');
  }
}
