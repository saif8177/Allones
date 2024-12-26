import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/login/services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  user: any = null;
  isEditing = false;
  updatedName: string = '';
  isPreviewVisible = false; // Flag for image preview modal
  previewImage: string | ArrayBuffer | null = null; // Store preview image URL
  selectedFile: File | null = null; // Store the selected file

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    // Fetch from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser?.email) {
      this.user = {
        name: storedUser.fullName || '',
        email: storedUser.email || '',
        profilePicture: storedUser.profilePicture || null,
      };
    }

    // Subscribe to AuthService updates
    this.authService.getUserObservable().subscribe((user) => {
      if (user) {
        this.user = {
          name: user.fullName || '',
          email: user.email || '',
          profilePicture: user.profilePicture || null,
        };
        localStorage.setItem('user', JSON.stringify(this.user)); // Persist user data
      }
    });
  }

  enableEditing() {
    this.isEditing = true;
    this.updatedName = this.user?.name;
  }

  async openImagePreview() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.previewImage = reader.result;
          this.isPreviewVisible = true; // Show the modal
        };
        reader.readAsDataURL(file);
      }
    };
  }

  async saveProfilePicture() {
    if (!this.selectedFile) {
      await this.showToast('No file selected.', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile);
    formData.append('email', this.user.email);

    const loader = await this.loadingController.create({
      message: 'Uploading...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loader.present();

    this.authService.uploadProfilePicture(formData).subscribe(
      async (response: any) => {
        await loader.dismiss();
        if (response.status === 'success') {
          this.user.profilePicture = response.filePath;
          localStorage.setItem('user', JSON.stringify(this.user)); // Persist updated profile picture
          this.selectedFile = null; // Reset file after successful upload
          this.isPreviewVisible = false; // Close preview modal
          await this.showToast('Profile picture updated successfully.', 'success');
        } else {
          await this.showToast(response.message || 'Upload failed.', 'danger');
        }
      },
      async (error) => {
        await loader.dismiss();
        await this.showToast('Failed to upload profile picture.', 'danger');
        console.error('Upload error:', error);
      }
    );
  }

  async deleteProfilePicture() {
    const loader = await this.loadingController.create({
      message: 'Deleting...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
    await loader.present();

    this.authService.deleteProfilePicture({ email: this.user?.email }).subscribe(
      async (response: any) => {
        await loader.dismiss();
        if (response.status === 'success') {
          this.user.profilePicture = null; // Clear profile picture
          localStorage.setItem('user', JSON.stringify(this.user)); // Persist changes
          await this.showToast('Profile picture deleted successfully.', 'success');
        } else {
          await this.showToast(response?.message || 'Unknown error.', 'danger');
        }
      },
      async (error) => {
        await loader.dismiss();
        await this.showToast('Failed to delete profile picture.', 'danger');
        console.error('Error deleting profile picture:', error);
      }
    );
  }

  async updateProfile() {
    const email = this.user?.email;
    this.authService.updateProfile({ email, fullName: this.updatedName }).subscribe(
      async (response: any) => {
        if (response.status === 'success') {
          this.user.name = this.updatedName;
          localStorage.setItem('user', JSON.stringify(this.user)); // Persist updated name
          this.isEditing = false;
          await this.showToast('Profile updated successfully.', 'success');
        } else {
          await this.showToast(response.message || 'Failed to update profile.', 'danger');
        }
      },
      async (error) => {
        await this.showToast('Failed to update profile. Please try again later.', 'danger');
        console.error('Update profile error:', error);
      }
    );
  }

  async logout() {
    localStorage.removeItem('user');
    this.authService.logout();
    this.router.navigate(['/login']);
    await this.showToast('Logged out successfully.', 'success');
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      buttons: [{ text: 'Close', role: 'cancel' }],
    });
    await toast.present();
  }
}
