import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/login/services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SignupService } from 'src/app/signup/services/signup.service';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user: any = null;
  isEditing = false;
  updatedName: string = '';

  constructor(private authService: AuthService, private signupService: SignupService, private router: Router, private toastController: ToastController) {}

  ngOnInit(): void {
    this.authService.getUserObservable().subscribe((user) => {
      this.user = {
        name: user?.fullName || '',
        email: user?.email || '',
      };
    });
  
  }
  
  loadUserData() {
    // Refresh user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = {
      name: storedUser.fullName || '', // Map fullName to name
      email: storedUser.email || '',
    };
  }
  
  enableEditing() {
    this.isEditing = true;
    this.updatedName = this.user?.name; // Pre-fill current name
  }
   // picture
   async uploadProfilePicture(event: any) {
    const file = event.target.files[0];
    if (!file) {
      await this.showToast('No file selected.', 'danger');
      return;
    }
  
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('email', this.user?.email);
  
    this.authService.uploadProfilePicture(formData).subscribe(
      async (response: any) => {
        if (response.status === 'success') {
          this.user.profilePicture = response.filePath; // Update profile picture in UI
          await this.showToast('Profile picture uploaded successfully.', 'success');
        } else {
          await this.showToast(response.message, 'danger');
        }
      },
      async () => {
        await this.showToast('Failed to upload profile picture.', 'danger');
      }
    );
  }
  

  async updateProfile() {
    const email = this.user?.email;
    this.authService.updateProfile({ email, fullName: this.updatedName }).subscribe(
      async (response: any) => {
        if (response.status === 'success') {
          this.user.name = this.updatedName; // Update UI
          this.isEditing = false;
          await this.showToast('Profile updated successfully.', 'success');
        } else {
          await this.showToast(response.message, 'danger');
        }
      },
      async () => {
        await this.showToast('Failed to update profile. Please try again later.', 'danger');
      }
    );
  }

  async logout() {
    localStorage.removeItem('user');
    this.authService.logout();
    this.router.navigate(['/login']); // Navigate to login
    await this.showToast('Logged out successfully.', 'success');
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }

}
