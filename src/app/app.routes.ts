import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/layout/pages/layout/layout.page').then((m) => m.LayoutPage),
    children: [
      {
        path: 'categories',
        loadChildren: () =>
          import('./features/categories/categories.routes').then((m) => m.CategoriesRoutes),
      },
    ],
  },
];
