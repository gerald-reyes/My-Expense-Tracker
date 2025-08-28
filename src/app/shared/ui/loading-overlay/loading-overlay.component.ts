import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  template: `
    @if (active()) {
      <div
        class="fixed inset-0 z-[10000] grid place-items-center bg-black/10 backdrop-blur-sm"
        role="presentation"
        aria-hidden="false"
      >
        <div
          class="grid place-items-center gap-3 min-w-[220px] rounded-xl bg-white p-6 shadow-2xl"
          role="status"
          aria-live="polite"
          [attr.aria-label]="label()"
          aria-busy="true"
          tabindex="-1"
        >
          <!-- Spinner -->
          <div
            class="h-11 w-11 rounded-full border-4 border-neutral-200 border-t-blue-500 animate-spin"
            aria-hidden="true"
          ></div>
          <div class="text-sm text-neutral-700">{{ label() }}</div>
        </div>
      </div>
    }
  `,
})
export class LoadingOverlayComponent {
  /** Show/hide the overlay (signal input) */
  active = input(false);
  /** Text under the spinner */
  label = input('Loading…');
}
