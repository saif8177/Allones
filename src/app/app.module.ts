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

@NgModule({
  declarations: [AppComponent, SignupComponent, WelcomeComponent, LoginComponent, CustomSnackBarComponent],
  imports: [MatSnackBarModule, MatIconModule, BrowserModule, FormsModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, BrowserAnimationsModule, ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
