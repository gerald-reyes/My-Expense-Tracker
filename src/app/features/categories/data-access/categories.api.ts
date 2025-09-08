import { inject, Injectable } from '@angular/core';
import { GraphQLService } from '../../../shared/utils/graphql/graphql.service';
import { gql } from 'apollo-angular';
import { map } from 'rxjs';
import { CategoryDto } from './models/category.dto';

type CreateCategoryInput = Pick<CategoryDto, 'name' | 'description' | 'isActive' | 'parentId'>;

type UpdateCategoryInput = Omit<CategoryDto, 'createdAt' | 'updatedAt'>;

@Injectable()
export class CategoriesApi {
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
          parentId
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
          parentId
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
          parentId
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
          parentId
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
          parentId
        }
      }
    `,
    update: gql`
      mutation ($input: UpdateExpenseCategoryInput!) {
        updateExpenseCategory(input: $input) {
          id
          name
          description
          createdAt
          updatedAt
          isActive
          parentId
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
        expenseCategory: CategoryDto | undefined;
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
    return this.gqlService.runQuery<{
      expenseCategories: CategoryDto[];
    }>(this.queries.getAll, {}, 'expenseCategories');
  }

  create(category: CreateCategoryInput) {
    return this.gqlService
      .runMutation<{
        createExpenseCategory: CategoryDto;
      }>(this.mutations.create, { input: { ...category } }, 'createExpenseCategory')
      .pipe(
        map((result) => {
          if (!result) {
            throw new Error('Failed to create expense category');
          }
          return result;
        }),
      );
  }

  update(category: UpdateCategoryInput) {
    return this.gqlService
      .runMutation<{
        updateExpenseCategory: CategoryDto;
      }>(this.mutations.update, { input: { ...category } }, 'updateExpenseCategory')
      .pipe(
        map((result) => {
          if (!result) {
            throw new Error(`Failed to update expense category with id ${category.id}`);
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
        searchExpenseCategories: CategoryDto[];
      }>(this.queries.searchByName, { name }, 'searchExpenseCategories')
      .pipe(map((categories) => categories || []));
  }

  filterByActiveStatus(isActive: boolean) {
    return this.gqlService
      .runQuery<{
        filterExpenseCategories: CategoryDto[];
      }>(this.queries.filterByActiveStatus, { isActive }, 'filterExpenseCategories')
      .pipe(map((categories) => categories || []));
  }
}
