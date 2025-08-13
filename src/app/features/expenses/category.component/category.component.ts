import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';

type Category = { name: string; description?: string };
type DialogData = { category?: Partial<Category> };
type DialogResult = Category | undefined;

@Component({
  selector: 'app-category.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  private fb = inject(FormBuilder); // new DI: inject()
  dialogRef = inject<DialogRef<DialogResult>>(DialogRef); // new DI: inject()
  data = inject<DialogData>(DIALOG_DATA);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    description: ['', [Validators.maxLength(255)]],
  });

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
