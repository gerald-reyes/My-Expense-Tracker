import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule, NgOptimizedImage],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  sidebarOpen = signal(false);
  today = new Date();

  links = [
    { label: 'Expenses', path: '/expenses' },
    { label: 'Expense Categories', path: '/expense/categories' },
    { label: 'History', path: '/history' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'Goals', path: '/goals' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Reports', path: '/reports' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'My Account', path: '/account' },
    { label: 'Logout', path: '/logout' },
  ];

  toggleSidebar() {
    this.sidebarOpen.update((open) => !open);
  }
}
