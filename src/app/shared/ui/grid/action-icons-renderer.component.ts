import { Component, HostBinding } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

type Params = ICellRendererParams & {
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  editIconClass?: string;
  deleteIconClass?: string;
};

@Component({
  selector: 'app-action-icons-renderer',
  template: `
    <div class="flex items-center gap-3">
      <!-- edit -->
      <i
        [class]="editIconClass"
        role="button"
        aria-label="Edit"
        title="Edit"
        tabindex="0"
        (click)="onEditClick()"
        (keydown.enter)="onEditClick()"
        (keydown.space)="onEditClick()"
        class="cursor-pointer text-slate-600 hover:text-blue-600 p-1 rounded-lg
               outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
      ></i>

      <!-- delete -->
      <i
        [class]="deleteIconClass"
        role="button"
        aria-label="Delete"
        title="Delete"
        tabindex="0"
        (click)="onDeleteClick()"
        (keydown.enter)="onDeleteClick()"
        (keydown.space)="onDeleteClick()"
        class="cursor-pointer text-slate-600 hover:text-red-600 p-1 rounded-lg
               outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
      ></i>
    </div>
  `,
})
export class ActionIconsRendererComponent implements ICellRendererAngularComp {
  private params!: Params;

  editIconClass = 'fa-solid fa-pen-to-square';
  deleteIconClass = 'fa-solid fa-trash';

  @HostBinding('class') hostClass = 'inline-flex';

  agInit(params: ICellRendererParams): void {
    this.params = params as Params;
    this.editIconClass = this.params.editIconClass || this.editIconClass;
    this.deleteIconClass = this.params.deleteIconClass || this.deleteIconClass;
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }

  onEditClick() {
    this.params.onEdit?.(this.params.data);
  }

  onDeleteClick() {
    this.params.onDelete?.(this.params.data);
  }
}
