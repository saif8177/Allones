import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  
 
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit() {
    // Initialize the login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Validate email format
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8), // Ensure at least 8 characters
        ],
      ],
      rememberMe: [false], // Checkbox state for "Remember Me"
    });

    // Load saved credentials if "Remember Me" was checked previously
    const savedCredentials = localStorage.getItem('loginCredentials');
    if (savedCredentials) {
      const { email, password } = JSON.parse(savedCredentials);
      this.loginForm.patchValue({ email, password, rememberMe: true });
    }
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }
  showSnackBar(message: string, icon: string = 'default') {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      duration: 3000,
      data: { message, icon },
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // Handle login form submission
  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response: { status: string; message: string; token: string; }) => {
          if (response.status === 'success') {
            this.showSnackBar(response.message);
            localStorage.setItem('authToken', response.token); // Store the token
            setTimeout(() => this.router.navigate(['/home']), 1500);
          } else {
            this.showSnackBar(response.message);
          }
        },
        (error: any) => {
          console.error('Error:', error);
          this.showSnackBar('Server error occurred.');
        }
      );
    } else {
      this.showSnackBar('Please enter valid credentials.');
    }
  }
  

}
