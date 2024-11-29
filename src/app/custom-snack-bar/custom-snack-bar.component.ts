import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-snack-bar',
  template: `
  <div class="snack-bar-container">
     <!-- Success Icon -->
     <img 
        *ngIf="data.icon === 'success-icon'" 
        src="assets/man.png" 
        alt="Success Icon" 
        class="snack-bar-icon success-icon"
      />
    <mat-icon *ngIf="data.icon === 'warning-icon'" class="snack-bar-icon warning-icon">warning</mat-icon>
    <span class="snack-bar-message">{{ data.message }}</span>
  </div>
`,
styles: [`
  .snack-bar-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .snack-bar-icon {
    width: 24px;
    height: 24px;
  }

.success-icon {
  color: green; /* Success icon color */
}

.warning-icon {
  color: red; /* Warning icon color */
}
  .snack-bar-message {
    font-size: 14px;
  }
`],
})
export class CustomSnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: {
icon: any; message: string 
}) {}
  
}
