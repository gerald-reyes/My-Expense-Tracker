import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoryApi } from '../../../infrastructure/api/expense-category.api';
import { ExpenseCategory } from '../../../domain/models/expense-category';
import { AgGridAngular } from 'ag-grid-angular';
import {
  themeBalham,
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type IRowNode,
} from 'ag-grid-community';

@Component({
  selector: 'app-categories.component',
  imports: [AgGridAngular, ReactiveFormsModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent {
  private gridApi!: GridApi<ExpenseCategory>;
  public theme = themeQuartz;
  searchControl = new FormControl<string>('');
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

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    filter: true,
  };

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

    this.searchControl.valueChanges.subscribe((searchTerm) => {
      if (this.gridApi) {
        this.gridApi.onFilterChanged();
      }
    });
  }

  onGridReady(params: GridReadyEvent<ExpenseCategory>) {
    this.gridApi = params.api;
  }

  isExternalFilterPresent = (): boolean => {
    return (this.searchControl.value?.trim()?.length || 0) > 0;
  };

  doesExternalFilterPass = (node: IRowNode<ExpenseCategory>): boolean => {
    if (node.data) {
      const searchTerm = this.searchControl.value?.trim().toLowerCase() || '';
      return (
        node.data.name.toLowerCase().includes(searchTerm) ||
        (node.data.description?.toLowerCase() ?? '').includes(searchTerm)
      );
    }
    return true;
  };
}
