import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuTabsComponent } from './menu-tabs/menu-tabs.component';
import { IonicModule } from '@ionic/angular'; 
import { RouterModule } from '@angular/router'; 

@NgModule({
  declarations: [MenuTabsComponent], // Declare reusable components
  imports: [CommonModule, IonicModule,RouterModule],          // Import CommonModule for Angular directives
  exports: [MenuTabsComponent],     // Export components for reuse
})
export class SharedModule {}
