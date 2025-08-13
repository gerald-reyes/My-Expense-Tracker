export const expensesCategoriesRoutes = [
  {
    path: 'categories',
    loadComponent: () =>
      import('./categories.component/categories.component').then(
        (m) => m.CategoriesComponent,
      ),
  },
];
