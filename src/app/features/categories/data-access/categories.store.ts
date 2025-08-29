import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CategoriesApi } from './categories.api';
import { toCategory } from '../data-access/category.adapter';
import type { Category } from '../data-access/models/category.model';
import { of, Subject } from 'rxjs';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';

type State = {
  loading: boolean;
  items: Category[] | null;
  selectedId: number | null;
  error: string | null;
};

const initial: State = {
  loading: false,
  items: null,
  selectedId: null,
  error: null,
};

@Injectable()
export class CategoriesStore {
  private readonly api = inject(CategoriesApi);
  private readonly destroy$ = new Subject<void>();
  private readonly state = signal<State>(initial);

  readonly loading = computed(() => this.state().loading);
  readonly items = computed(() => this.state().items);
  readonly selected = computed(() => {
    const s = this.state();
    return s.items?.find((p) => p.id === s.selectedId) ?? null;
  });
  readonly error = computed(() => this.state().error);

  private readonly _selectionLogger = effect(() => {
    void this.selected();
  });

  select(id: number | null) {
    this.patch({ selectedId: id });
  }

  getAll() {
    this.patch({ loading: true, error: null });

    return this.api.getAll().pipe(
      delay(2000), // simulate network delay
      map((dtos) => (dtos ?? []).map(toCategory)),
      tap((categories) => {
        this.patch({ items: categories });
      }),
      catchError((error) => {
        this.patch({ error: error?.message ?? 'Failed to load' });
        return of([]);
      }),
      finalize(() => {
        this.patch({ loading: false });
      }),
    );
  }

  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.api.create(category).pipe(
      delay(3000),
      map(toCategory),
      tap((category) => {
        this.patch({ items: [...(this.state().items ?? []), category] });
      }),
      catchError((error) => {
        this.patch({ error: error?.message ?? 'Failed to create' });
        return of(null);
      }),
    );
  }

  private patch(p: Partial<State>) {
    this.state.set({ ...this.state(), ...p });
  }
}
