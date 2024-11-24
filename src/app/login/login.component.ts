import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  passwordVisible: boolean = false;
  

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar) {}

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
      const { email, password, rememberMe } = this.loginForm.value;

      if (rememberMe) {
        localStorage.setItem('loginCredentials', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('loginCredentials');
      }
        
      this.showSnackBar('Welcome Back!', 'smile-icon');
      
      this.router.navigate(['/home'])
        .then(success => {
          if (success) {
            console.log('Navigation to home successful.');
          } else {
            console.error('Navigation failed!');
          }
        })
        .catch(err => console.error('Navigation error:', err));
    } else {
      this.snackBar.open('Please fill out the form correctly.', 'smile-icon', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
  

}
