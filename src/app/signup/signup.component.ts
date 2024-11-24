import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  passwordVisible: boolean = false;
  toastMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router) {}

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

  // Show a toast message
  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = '';
    }, 3000);
  }

  // Handle form submission
  onSubmit() {
    console.log('Form Submitted:', this.signupForm.value);
    console.log('Password validity:', this.signupForm.get('password')?.errors);
    console.log('Form validity:', this.signupForm.valid);

    if (this.signupForm.valid) {
      this.showToast('Account created successfully!');
      setTimeout(() => {
        this.router.navigate(['/home']).catch((err) =>
          console.error('Navigation error:', err)
        );
      }, 1500);
    } else {
      this.showToast('Please fill all fields correctly.');
    }
  }
}
 
    

