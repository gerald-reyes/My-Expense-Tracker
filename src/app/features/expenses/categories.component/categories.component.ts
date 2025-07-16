import { Component, inject, signal } from '@angular/core';
import { ExpenseCategoryApi } from '../../../infrastructure/api/expense-category.api';
import { ExpenseCategory } from '../../../domain/models/expense-category';
import { AgGridAngular } from 'ag-grid-angular';
import type { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-categories.component',
  imports: [AgGridAngular],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  addCategory() {
    throw new Error('Method not implemented.');
  }
  expenseCategoryApi = inject(ExpenseCategoryApi);
  expenseCategories = signal<ExpenseCategory[] | undefined>(undefined);
  loading = signal(true);
  error = signal<any>(undefined);

  // Correctly typed column definitions for ag-grid
  columnDefs: ColDef<ExpenseCategory>[] = [
    { field: 'id', headerName: 'ID', sortable: true, filter: true },
    { field: 'name', headerName: 'Name', sortable: true, filter: true },
    {
      field: 'description',
      headerName: 'Description',
      sortable: true,
      filter: true,
      flex: 1, // This column will expand to take extra space
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      sortable: true,
      filter: true,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      sortable: true,
      filter: true,
    },
    { field: 'isActive', headerName: 'Active', sortable: true, filter: true },
  ];

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
