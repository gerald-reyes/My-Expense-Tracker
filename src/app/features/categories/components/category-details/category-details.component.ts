import { Component, input, output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Category } from '../../data-access/models/category.model';

type DialogResult = Category | null;
type CategoryDetailsDialogData = {
  category?: Category;
  parentCategories: Category[];
};

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent {
  private fb = inject(FormBuilder);
  dialogRef = inject<DialogRef<DialogResult>>(DialogRef);
  readonly data = inject<CategoryDetailsDialogData>(DIALOG_DATA, {});
  isSaving = input(false);
  isEditMode = false;
  parentCategories: Category[] = [];
  error = input<string | null>(null);
  saveRequested = output<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>();
  updateRequested = output<Omit<Category, 'createdAt' | 'updatedAt'>>();

  form: FormGroup;

  constructor() {
    this.isEditMode = !!this.data.category?.id;

    this.parentCategories = this.data.parentCategories;

    this.form = this.fb.group({
      id: [this.data.category?.id || null],
      name: [this.data.category?.name || '', [Validators.required]],
      description: [this.data.category?.description || '', [Validators.maxLength(255)]],
      isActive: [this.data.category?.isActive || false],
      parentId: [this.data.category?.parentId || null],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.isEditMode) {
        this.updateRequested.emit({
          id: this.form.value.id,
          name: this.form.value.name,
          description: this.form.value.description,
          isActive: !!this.form.value.isActive,
          parentId: this.form.value.parentId ? +this.form.value.parentId : null,
        });
      } else {
        this.saveRequested.emit({
          name: this.form.value.name,
          description: this.form.value.description,
          isActive: !!this.form.value.isActive,
          parentId: this.form.value.parentId ? +this.form.value.parentId : null,
        });
      }
    }
  }
}
