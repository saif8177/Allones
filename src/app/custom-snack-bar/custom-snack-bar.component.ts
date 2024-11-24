import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snack-bar',
  template: `
    <div style="display: flex; align-items: center;">
      <mat-icon style="margin-right: 8px;">warning</mat-icon>
      <span>{{ data.message }}</span>
    </div>
  `,
  styles: [
    `
      mat-icon {
        font-size: 24px;
        color: #f44336; /* Red for warning */
      }
      span {
        font-size: 16px;
      }
    `,
  ],
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: { message: string }) {}
}
