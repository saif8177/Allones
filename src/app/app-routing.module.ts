import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { FlashScreenComponent } from './flash-screen/flash-screen.component';
import { AuthGuard } from './auth.guard';
import { HomePage } from './home/home.page';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RestaurantsListComponent } from './home/restaurants/restaurants-list/restaurants-list.component';
import { MenuTabsComponent } from './Tabs/menu-tabs/menu-tabs.component';
import { AccountComponent } from './Tabs/account/account.component';
import { CartComponent } from './Tabs/cart/cart.component';



const routes: Routes = [
  {
    path: 'flashscreen',
    component: FlashScreenComponent // Load FlashScreenComponent directly
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard],
    
  },
  {
    path: '',
    redirectTo: 'flashscreen',
    pathMatch: 'full'
  },
  
  
  { path: 'signup', component: SignupComponent },
  { path: 'account', component: AccountComponent },
  { path: 'cart', component: CartComponent },
  { path: 'menutabs', component: MenuTabsComponent},
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'restaurants', component: RestaurantsListComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
