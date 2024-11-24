import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { CustomSnackBarComponent } from '../custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passwordVisible: boolean = false;
  toastMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private snackBar: MatSnackBar ) {}

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
   showSnackBar(message: string) {
    this.snackBar.openFromComponent(CustomSnackBarComponent, {
      duration: 3000, // Duration in milliseconds
      data: { message }, // Pass the message dynamically
      horizontalPosition: 'center', // Align horizontally
      verticalPosition: 'top', // Align vertically
    });
  }

  // Handle form submission
  onSubmit() {
   
    if (this.signupForm.valid) {
      this.showSnackBar('Account created successfully!');
      setTimeout(() => {
        this.router.navigate(['/home']).catch((err) =>
          console.error('Navigation error:', err)
        );
      }, 1500);
    } else {
      this.showSnackBar('Please fill all fields correctly.');
    }
  }
}
 
    

