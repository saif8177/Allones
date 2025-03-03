import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';
import { SignupService } from './services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passwordVisible: boolean = false;
  toastMessage: string = '';
  loading: boolean = false; 

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar, private signupService: SignupService ) {}

  ngOnInit() {
  this.signupForm = this.fb.group(
    {
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordMatchValidator }
  );
}

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

   // Show a MatSnackBar message
   showSnackBar(message: string, icon: string = 'default') {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      duration: 3000,
      data: { message, icon },
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Handle form submission
  onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      const userData = this.signupForm.value;

      
      this.signupService.registerUser(userData).subscribe(
        (response: { status: string; message: string; token: any; }) => {
          setTimeout(() => {
            this.loading = false;
          
          if (response.status === 'success') {
            this.showSnackBar(response.message,'success-icon');
             // Store user details in local storage
             localStorage.setItem('user', JSON.stringify({
              fullName: userData.fullName,
              email: userData.email
            }));
            localStorage.setItem('authToken', response.token || ''); // Save token if provided
            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1500);
          } else {
            this.showSnackBar(response.message, 'warning-icon');
          }
        },3000);
        },
        (error: any) => {
          
          console.error('HTTP Error:', error);
          this.showSnackBar('Server error occurred.', 'warning-icon');
        }
      );
    } else {
      this.showSnackBar('Please fill all fields correctly.');
    }
  }
}
 
    

