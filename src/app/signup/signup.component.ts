import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router to handle navigation
import { NgForm } from '@angular/forms'; 

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {
  passwordVisible: boolean = false; 
  successMessage: string = '';
  toastMessage: string = '';
  user = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  };


  // Password validation regex (minimum 8 characters, at least one letter, one number, and one symbol)
  passwordPattern: string = '^(?=.*[A-Za-z])(?=.*\d)(?=.*[!$%^&*()_+|~=`{}\[\]:";<>?,./]).{8,}$';

  // Toggle password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }


// Function to validate email format
isEmailValid(email: string): boolean {
  const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
  return emailRegex.test(email);
}

   // Function to validate password format
   isPasswordValid(password: string): boolean {
    const passwordRegex = new RegExp(this.passwordPattern);
    return passwordRegex.test(password);
  }
  isFormValid(): boolean {
    return (
      !!this.user.fullName && // Ensure fullName is non-empty
      this.isEmailValid(this.user.email) &&
      this.isPasswordValid(this.user.password) &&
      this.user.password === this.user.confirmPassword
    );
  }
  

  // Show a toast message
  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => {
      this.toastMessage = ''; // Clear the message after 3 seconds
    }, 3000);
  }

  // Handle form submission
  onSubmit() {
    if (this.isFormValid()) {
      this.showToast('Account created successfully!');
      setTimeout(() => {
        this.router.navigate(['/home']); // Navigate to the home page
      }, 1500);
    } else {
      this.showToast('Wrong email or enter correct password');
    }
  }


  constructor(private router: Router) {}
  
  ngOnInit() {}

}
