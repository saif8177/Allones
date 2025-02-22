import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  showOptions = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private cdr: ChangeDetectorRef // For UI updates
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }
  toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  loadUserData() {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (storedUser && storedUser.email) {
      // Initially set profile picture to default image
      this.user = {
        name: storedUser.name || '',
        email: storedUser.email,
        profilePicture: 'assets/finaldesign.png', // Set default image initially
      };

        // Update local storage with default profile picture
    localStorage.setItem('user', JSON.stringify(this.user));
    this.cdr.detectChanges(); // Update the UI

      // Retrieve user details from the backend
      this.authService.retrieveUserProfile(storedUser.email).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            // Update user data with actual profile picture if available
            this.user = {
              name: response.user.fullName || '',
              email: storedUser.email,
              profilePicture: response.user.profilePicture || 'assets/finaldesign.png', // Set default if null
            };
            localStorage.setItem('user', JSON.stringify(this.user)); // Update local storage
            this.cdr.detectChanges(); // Update UI
          } else {
            console.error('Failed to load user profile:', response.message);
          }
        },
        (error) => {
          console.error('Error retrieving user profile:', error);
        }
      );
    }
  
    // Subscribe to user observable for dynamic updates
    this.authService.getUserObservable().subscribe((user) => {
      if (user) {
        this.user = {
          name: user.fullName || '',
          email: user.email,
          profilePicture: user.profilePicture || 'assets/finaldesign.png', // Set default image if null
        };
  
        localStorage.setItem('user', JSON.stringify(this.user)); // Update local storage
        this.cdr.detectChanges(); // Update UI
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
    this.showOptions = false; 
  }

  async saveProfilePicture() {
    if (!this.selectedFile) {
      await this.showToast('No file selected.', 'danger');
      return;
    }
  
    const formData = new FormData();
    const renamedFile = new File(
      [this.selectedFile],
      `${this.user.name.replace(/\s+/g, '_')}_${this.selectedFile.name}`,
      { type: this.selectedFile.type }
    );
    formData.append('profilePicture', renamedFile);
    formData.append('email', this.user.email);
  
    const loader = await this.loadingController.create({
      message: 'Uploading...',
      spinner: 'crescent',
      backdropDismiss: false,
    });
  
    await loader.present();
  
    this.authService.uploadProfilePicture(formData).subscribe(
      async (response: any) => {
        if (response.status === 'success') {
          // Ensure the full URL is only prepended if necessary
          const imageUrl = response.filePath.startsWith('http')
            ? response.filePath
            : `http://localhost/uploads/${response.filePath}`;

          this.user.profilePicture = imageUrl;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.selectedFile = null;
          this.isPreviewVisible = false;
          await this.showToast('Profile picture updated successfully.', 'success');
        } else {
          await this.showToast(response.message || 'Upload failed.', 'danger');
        }
        const focusableElement = document.querySelector('#main-content');
        if (focusableElement instanceof HTMLElement) {
          focusableElement.focus();
        }
        await loader.dismiss();
      },
      async (error) => {
        await this.showToast('Failed to upload profile picture.', 'danger');
        console.error('Upload error:', error);
        await loader.dismiss();
      }
    );
  }

  async deleteProfilePicture() {
    this.showOptions = false; 
    const loader = await this.loadingController.create({
      message: 'Deleting...',
      spinner: 'lines',
      backdropDismiss: false,
    });
  
    await loader.present();
  
    this.authService.deleteProfilePicture({ email: this.user?.email }).subscribe(
      async (response: any) => {
        if (response.status === 'success') {
          this.user.profilePicture = 'assets/finaldesign.png';
          localStorage.setItem('user', JSON.stringify(this.user));
          await this.showToast('Profile picture deleted successfully.', 'success');
        } else {
          await this.showToast(response?.message || 'Unknown error.', 'danger');
        }
        const focusableElement = document.querySelector('#main-content'); 
        if (focusableElement instanceof HTMLElement) {
          focusableElement.focus();
        }
        await loader.dismiss();
      },
      async (error) => {
        await this.showToast('Failed to delete profile picture.', 'danger');
        console.error('Error deleting profile picture:', error);
        await loader.dismiss();
      }
    );
  }

  async updateProfile() {
    const email = this.user?.email;
    this.authService.updateProfile({ email, fullName: this.updatedName }).subscribe(
      async (response: any) => {
        if (response.status === 'success') {
          this.user.name = this.updatedName;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.isEditing = false;
          this.cdr.detectChanges(); // Update UI
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
