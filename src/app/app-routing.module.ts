import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { FlashScreenComponent } from './flash-screen/flash-screen.component';
import { HomePage } from './home/home.page';
const routes: Routes = [
  {
    path: 'flashscreen',
    component: FlashScreenComponent // Load FlashScreenComponent directly
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'flashscreen',
    pathMatch: 'full'
  },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomePage },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
