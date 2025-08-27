import { Component, input, output, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Category } from '../../data-access/models/category.model';

type DialogData = { category: Partial<Category> };
type DialogResult = Category;

@Component({
  selector: 'app-category-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent {
  private fb = inject(FormBuilder); // new DI: inject()
  dialogRef = inject<DialogRef<DialogResult>>(DialogRef); // new DI: inject()
  data = inject<DialogData>(DIALOG_DATA);
  isSaving = input(false);
  error = input<string | null>(null);
  saveRequested = output<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>();

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(255)]],
  });

  /* closeDialog(): void {
    this.dialogRef.close();
  } */

  onSubmit(): void {
    if (this.form.valid) {
      this.saveRequested.emit(this.form.value as Omit<Category, 'id' | 'createdAt' | 'updatedAt'>);
      //this.dialogRef.close(this.form.value);
    }
  }
}
