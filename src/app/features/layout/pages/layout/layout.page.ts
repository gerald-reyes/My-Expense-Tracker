import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './layout.page.html',
})
export class LayoutPage {
  sidebarOpen = signal(false);
  today = new Date();

  links = [
    { label: 'Categories', path: '/categories' },
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
