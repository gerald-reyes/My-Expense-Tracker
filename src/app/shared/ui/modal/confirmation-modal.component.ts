import { Component, input, output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';

type DialogResult = boolean;

export interface ConfirmDialogData {
  title?: string;
  message?: string;
  acceptText?: string; // default: "Accept"
  cancelText?: string; // default: "Cancel"
  danger?: boolean; // style accept as destructive
}

@Component({
  selector: 'app-confirmation-modal',
  imports: [CommonModule, ReactiveFormsModule],
  template: ` <div class="w-full max-w-md outline-none" role="dialog" aria-modal="true">
    <div
      cdkTrapFocus
      class="rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/40"
      aria-labelledby="dialog-title"
    >
      <div class="px-6 pt-5">
        <h2
          id="dialog-title"
          class="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
          {{ title() }}
        </h2>
        <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-100">
          {{ message() }}
        </p>
      </div>

      <div class="mt-6 flex items-center justify-end gap-3 px-6 pb-5">
        <button
          type="button"
          class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium bg-neutral-500 hover:bg-neutral-600 text-white"
          (click)="close(false)"
          [disabled]="isSaving()"
        >
          {{ cancelText() }}
        </button>

        <button
          type="button"
          data-autofocus
          class="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium"
          [ngClass]="
            danger()
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          "
          (click)="onConfirm()"
        >
          <span class="flex items-center gap-2">
            @if (isSaving()) {
              <span
                class="h-5 w-5 animate-spin rounded-full border-3 border-slate-300 border-t-transparent"
              ></span>
            }
            {{ isSaving() ? 'Submitting…' : acceptText() }}
          </span>
        </button>
      </div>
    </div>
  </div>`,
})
export class ConfirmationModalComponent {
  dialogRef = inject<DialogRef<DialogResult>>(DialogRef); // new DI: inject()
  readonly data = inject<ConfirmDialogData>(DIALOG_DATA);
  isSaving = input(false);
  error = input<string | null>(null);
  confirmationEvent = output();
  title = signal(this.data.title ?? 'Confirm');
  message = signal(this.data.message ?? 'Are you sure?');
  acceptText = signal(this.data.acceptText ?? 'Accept');
  cancelText = signal(this.data.cancelText ?? 'Cancel');
  danger = signal(!!this.data.danger);

  close(result: boolean | undefined) {
    this.dialogRef.close(result);
  }

  onConfirm(): void {
    this.confirmationEvent.emit();
  }
}
