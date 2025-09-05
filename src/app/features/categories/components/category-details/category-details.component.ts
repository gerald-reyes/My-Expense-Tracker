import { Component, input, output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Category } from '../../data-access/models/category.model';

type DialogData = { category: Partial<Category> };
type DialogResult = Category | null;

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent {
  private fb = inject(FormBuilder); // new DI: inject()
  dialogRef = inject<DialogRef<DialogResult>>(DialogRef); // new DI: inject()
  readonly data = inject<Category | null>(DIALOG_DATA, { optional: true });
  isEditMode = signal(!!this.data?.id);
  isSaving = input(false);
  error = input<string | null>(null);
  saveRequested = output<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>();
  updateRequested = output<Omit<Category, 'createdAt' | 'updatedAt'>>();

  form: FormGroup = this.fb.group({
    id: [this.data?.id || null],
    name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(255)]],
    isActive: [this.data?.isActive || false],
  });

  closeDialog(): void {
    this.dialogRef.close();
  }

  constructor() {
    this.isEditMode.set(!!this.data?.id);
    if (this.data) {
      this.form.patchValue({
        id: this.data.id,
        name: this.data.name,
        description: this.data.description,
        isActive: this.data.isActive,
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditMode()) {
        this.updateRequested.emit(this.form.value as Omit<Category, 'createdAt' | 'updatedAt'>);
      } else {
        this.saveRequested.emit(
          this.form.value as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>,
        );
      }
      //this.dialogRef.close(this.form.value);
    }
  }
}
