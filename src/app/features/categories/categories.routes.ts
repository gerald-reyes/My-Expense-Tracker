import { Routes } from '@angular/router';

export const CategoriesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/categories-list/categories-list.page').then((m) => m.CategoriesListPage),
  },
];
