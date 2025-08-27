import { Injectable, inject } from '@angular/core';
import { CategoriesStore } from '../data-access/categories.store';
import { Category } from './models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoriesFacade {
  private readonly store = inject(CategoriesStore);
  readonly loading = this.store.loading;
  readonly categories = this.store.items;
  readonly selected = this.store.selected;
  readonly error = this.store.error;

  getAll() {
    return this.store.getAll();
  }

  create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.store.create(category);
  }

  select(id: number | null) {
    this.store.select(id);
  }
}
