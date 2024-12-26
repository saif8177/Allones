import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { RestaurantsListComponent } from './restaurants/restaurants-list/restaurants-list.component';
import { MenuTabsComponent } from '../Tabs/menu-tabs/menu-tabs.component';
import { SharedModule } from '../Tabs/shared.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    
  ],
  declarations: [HomePage, RestaurantsListComponent, ],
})
export class HomePageModule {}
