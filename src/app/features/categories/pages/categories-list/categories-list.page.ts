import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../data-access/models/category.model';
import { AgGridAngular } from 'ag-grid-angular';
import {
  themeQuartz,
  type ColDef,
  type GridApi,
  type GridReadyEvent,
  type IRowNode,
} from 'ag-grid-community';
import { Dialog } from '@angular/cdk/dialog';
import { CategoryDetailsComponent } from '../../components/category-details/category-details.component';
import { CategoriesFacade } from '../../data-access/categories.facade';
import { CategoriesApi } from '../../data-access/categories.api';
import { CategoriesStore } from '../../data-access/categories.store';
import { pipe, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories-list-page',
  imports: [AgGridAngular, ReactiveFormsModule],
  templateUrl: './categories-list.page.html',
  providers: [CategoriesFacade, CategoriesApi, CategoriesStore],
})
export class CategoriesListPage {
  readonly categoriesFacade = inject(CategoriesFacade);
  readonly dialog = inject(Dialog);
  private gridApi!: GridApi<Category>;
  public theme = themeQuartz;
  loading = this.categoriesFacade.loading;
  error = this.categoriesFacade.error;
  searchControl = new FormControl<string>('');
  lastResult: unknown;
  private destroy$ = new Subject<void>();

  // Correctly typed column definitions for ag-grid
  columnDefs: ColDef<Category>[] = [
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
    this.categoriesFacade.getAll().pipe(takeUntil(this.destroy$)).subscribe();

    this.searchControl.valueChanges.subscribe((searchTerm) => {
      if (this.gridApi) {
        this.gridApi.onFilterChanged();
      }
    });
  }

  onGridReady(params: GridReadyEvent<Category>) {
    this.gridApi = params.api;
  }

  isExternalFilterPresent = (): boolean => {
    return (this.searchControl.value?.trim()?.length || 0) > 0;
  };

  doesExternalFilterPass = (node: IRowNode<Category>): boolean => {
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
    const ref = this.dialog.open(CategoryDetailsComponent, {
      data: { category: { name: '', description: '' } },
      disableClose: true, // prevent accidental dismiss while saving
      backdropClass: ['bg-black/40'],
    });

    const handleSaveRequest = (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('category: ', category);
      ref.componentRef!.setInput('isSaving', true);
      this.categoriesFacade
        .create(category)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            ref.componentRef!.setInput('isSaving', false);
            ref.close();
          },
          error: (error) => {
            ref.componentRef!.setInput('isSaving', false);
            ref.componentRef!.setInput('error', error);
          },
        });
    };

    const saveRequestedSubscription =
      ref.componentInstance!.saveRequested.subscribe(handleSaveRequest);

    // Ensure subscription is cleaned up if the dialog is closed prematurely
    ref.closed.subscribe(() => saveRequestedSubscription.unsubscribe());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
