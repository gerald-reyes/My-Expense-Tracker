import { inject, Injectable, signal, OnDestroy } from '@angular/core';
import { ExpenseCategoryApi } from '../../infrastructure/api/expense-category.api';
import { Subject, takeUntil } from 'rxjs';
import { ExpenseCategory } from '../../domain/models/expense-category';

@Injectable()
export class ExpensesCategoriesService implements OnDestroy {
  private destroy$ = new Subject<void>();
  expenseCategoryApi = inject(ExpenseCategoryApi);
  readonly loading = signal(false);
  readonly error = signal(null);
  readonly category = signal<ExpenseCategory | null>(null);
  readonly categories = signal<ExpenseCategory[] | null>(null);
  createExpenseCategory(categoryData: any) {
    this.loading.set(true);
    this.expenseCategoryApi
      .create(categoryData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.category.set(response);
          this.loading.set(false);
          this.error.set(null);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error);
        },
      });
  }

  getAll() {
    this.loading.set(true);
    this.expenseCategoryApi
      .getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.loading.set(false);
          this.categories.set(categories);
          this.error.set(null);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
