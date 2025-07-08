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
          import('./features/expenses/expenses.routes').then((m) => m.expensesRoutes),
      },
    ],
  },
];
