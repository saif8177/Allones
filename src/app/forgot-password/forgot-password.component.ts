import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  loading: boolean = false; // Controls progress bar visibility
  successMessage: string = '';
  step: number = 1;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        ],
      ],
    });

    this.resetPasswordForm = this.fb.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Simulate loading effect for 2 seconds on submit
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true; // Show progress bar
      setTimeout(() => {
        this.loading = false; // Hide progress bar after 2 seconds
       const email = this.forgotPasswordForm.get('email')?.value;

        this.http.post('http://localhost/reset-password.php', { email }).subscribe(
          (response: any) => {
            console.log('API response:', response); 
            if (response.status === 'success') {
              this.step = 2;
              this.showSnackBar('Email verified! Proceed to reset password.');
            } else {
              this.showSnackBar('Email not found. Please try again.');
            }
          },
          (error) => {
            console.error('Error:', error);
            this.showSnackBar('An error occurred. Please try again.');
          }
        );
      }, 2000); // Simulate progress bar for 2 seconds
    }
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.valid) {
      this.loading = true; // Show progress bar
      setTimeout(() => {
        this.loading = false; // Hide progress bar after 2 seconds
        const newPassword = this.resetPasswordForm.get('newPassword')?.value;
        const email = this.forgotPasswordForm.get('email')?.value;

        this.http
          .post('http://localhost/update-password.php', { email, newPassword })
          .subscribe(
            (response: any) => {
              if (response.status === 'success') {
                this.showSnackBar('Password reset successful! Please login.');
                setTimeout(() => {
                  this.router.navigate(['/login']);
                },5000);
              } else {
                console.error('Password reset failed:', response);
                this.showSnackBar('Password reset failed. Try again.');
              }
            },
            (error) => {
              console.error('Error:', error);
              this.showSnackBar(
                error.status === 0
                  ? 'Network error. Please check your backend or CORS policy.'
                  : 'An error occurred. Please try again.'
              );
            }
          );
      }, 2000); // Simulate progress bar for 2 seconds
    }
  }
}
