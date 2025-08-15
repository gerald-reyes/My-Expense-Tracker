import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategory } from '../../../domain/models/expense-category';
import { AgGridAngular } from 'ag-grid-angular';
import {
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type IRowNode,
} from 'ag-grid-community';
import { Dialog } from '@angular/cdk/dialog';
import { CategoryComponent } from '../category.component/category.component';
import { ExpensesCategoriesService } from '../expenses.categories.service';
import { ExpenseCategoryApi } from '../../../infrastructure/api/expense-category.api';

@Component({
  selector: 'app-categories.component',
  imports: [AgGridAngular, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  providers: [ExpensesCategoriesService, ExpenseCategoryApi],
})
export class CategoriesComponent {
  private readonly expensesCategoriesService = inject(ExpensesCategoriesService);
  private dialog = inject(Dialog);
  private gridApi!: GridApi<ExpenseCategory>;
  public theme = themeQuartz;
  expenseCategories = this.expensesCategoriesService.categories;
  loading = this.expensesCategoriesService.loading;
  error = this.expensesCategoriesService.error;
  searchControl = new FormControl<string>('');
  lastResult: unknown;

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

    this.expensesCategoriesService.getAll();

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

  addCategory() {
    const ref = this.dialog.open(CategoryComponent, {
      data: { category: { name: '', description: '' } },
      backdropClass: ['bg-black/40'],
    });
    ref.closed.subscribe((result) => (this.lastResult = result)); // {name,email} or undefined
  }
}
