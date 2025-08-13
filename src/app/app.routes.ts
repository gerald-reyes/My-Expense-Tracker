import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/layout.component/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'expenses',
        loadChildren: () =>
          import('./features/expense_categories/expenses.categories.routes').then(
            (m) => m.expensesCategoriesRoutes,
          ),
      },
    ],
  },
];
