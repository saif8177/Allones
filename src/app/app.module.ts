import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SignupComponent } from './signup/signup.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomSnackBarComponent } from './custom-snack-bar/custom-snack-bar.component';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import Progress Bar Module
import { AccountComponent } from './Tabs/account/account.component';
import { CartComponent } from './Tabs/cart/cart.component';

@NgModule({
  declarations: [AppComponent, CartComponent, AccountComponent,SignupComponent, WelcomeComponent, LoginComponent, CustomSnackBarComponent, ForgotPasswordComponent],
  imports: [MatProgressBarModule, MatSnackBarModule,HttpClientModule, IonicModule,MatIconModule, BrowserModule, FormsModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, BrowserAnimationsModule, ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
