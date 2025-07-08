import { Component, inject, signal } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ExpenseCategoryApi } from '../../../infrastructure/api/expense-category.api';
import { ExpenseCategory } from '../../../domain/models/expense-category';

@Component({
  selector: 'app-categories.component',
  imports: [],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  expenseCategoryApi = inject(ExpenseCategoryApi);
  expenseCategories = signal<ExpenseCategory[] | undefined>(undefined);
  loading = signal(true);
  error = signal<any>(undefined);

  ngOnInit() {
    this.loading.set(true);

    this.expenseCategoryApi.getAll().subscribe({
      next: (categories) => {
        this.expenseCategories.set(categories);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error);
        this.loading.set(false);
      },
    });
  }
}
