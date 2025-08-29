import { Component, effect, EffectRef, inject, signal } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { ActionIconsRendererComponent } from '../../../../shared/ui/grid/action-icons-renderer.component';

@Component({
  selector: 'app-categories-list-page',
  imports: [AgGridAngular, ReactiveFormsModule],
  templateUrl: './categories-list.page.html',
  providers: [CategoriesFacade, CategoriesApi, CategoriesStore],
})
export class CategoriesListPage {
  confirmDelete(row: any) {
    throw new Error('Method not implemented.');
  }
  openEditDialog(data: any) {
    throw new Error('Method not implemented.');
  }
  readonly categoriesFacade = inject(CategoriesFacade);
  readonly dialog = inject(Dialog);
  private gridApi!: GridApi<Category>;
  public theme = themeQuartz;
  loading = this.categoriesFacade.loading;
  error = this.categoriesFacade.error;
  categories = this.categoriesFacade.categories;
  // hold the grid api in a signal too
  gridApiSig = signal<GridApi | null>(null);
  searchControl = new FormControl<string>('');
  lastResult: unknown;
  private destroy$ = new Subject<void>();

  // Correctly typed column definitions for ag-grid
  columnDefs: ColDef<Category>[] = [
    {
      headerName: 'Actions',
      cellRenderer: ActionIconsRendererComponent,
      cellRendererParams: {
        onEdit: (row: any) => this.openEditDialog(row),
        onDelete: (row: any) => this.confirmDelete(row),
        editIconClass: 'fa-solid fa-pen-to-square',
        deleteIconClass: 'fa-solid fa-trash',
      },
      //width: 100,
      sortable: false,
      filter: false,
    },
    { field: 'id', headerName: 'ID', sortable: true, filter: true },
    { field: 'isActive', headerName: 'Active', sortable: true, filter: true },
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
      sort: 'desc',
      filter: true,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      sortable: true,
      filter: true,
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    filter: true,
  };

  // Tailwind-based spinner shown by the grid overlay
  overlayLoadingTemplate = `<div class="flex items-center justify-center h-full">
       <div class="inline-flex items-center gap-3 text-slate-600">
         <span class="h-10 w-10 animate-spin rounded-full border-6 border-slate-300 border-t-transparent"></span>
         <span class="font-bold text-2xl">Loading…</span>
       </div>
     </div>`;

  // Optional: what to show when there are no rows
  overlayNoRowsTemplate = `<div class="flex items-center justify-center h-full text-slate-500">No rows</div>`;

  ngOnInit() {
    this.categoriesFacade.getAll().pipe(takeUntil(this.destroy$)).subscribe();

    this.searchControl.valueChanges.subscribe((searchTerm) => {
      if (this.gridApi) {
        this.gridApi.onFilterChanged();
      }
    });
  }

  // create the effect in a field initializer (valid injection context)
  private overlayEffect = effect(() => {
    const api = this.gridApiSig(); // reactive
    const data = this.categories(); // reactive
    if (!api) return;

    if (data === null) {
      api.showLoadingOverlay();
    } else if (data.length > 0) {
      api.hideOverlay();
    } else {
      api.showNoRowsOverlay();
    }
  });

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.showLoadingOverlay(); // immediate spinner
    this.gridApiSig.set(params.api); // triggers the effect when data changes
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
    this.overlayEffect?.destroy();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
