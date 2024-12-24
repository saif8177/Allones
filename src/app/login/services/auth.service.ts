import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loginUrl = 'http://localhost/login.php'; // Login API
  private updateUrl = 'http://localhost/update_profile.php'; // Update Profile API
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Login
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials).pipe(
      tap((response: any) => {
        if (response.status === 'success') {
          const userData = {
            fullName: response.user.fullName,
            email: response.user.email,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          this.userSubject.next(userData);
           // Force reload to refresh data
        }
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem('user'); // Clear localStorage
    this.userSubject.next(null); // Clear BehaviorSubject
    
  }

  // Get User Details
  getUserDetails(): any {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  uploadProfilePicture(formData: FormData): Observable<any> {
    const uploadUrl = 'http://localhost/upload_profile_picture.php'; // Backend endpoint
    return this.http.post(uploadUrl, formData);
  }
  
 // Update Profile
updateProfile(data: { email: string; fullName: string }): Observable<any> {
  return this.http.post(this.updateUrl, data).pipe(
    tap((response: any) => {
      if (response.status === 'success') {
        const updatedUser = { ...this.getUserDetails(), fullName: data.fullName }; // Update local copy
        localStorage.setItem('user', JSON.stringify(updatedUser)); // Save updated data
        this.userSubject.next(updatedUser); // Notify subscribers
      }
    })
  );
}

// Expose User as Observable
getUserObservable(): Observable<any> {
  return this.userSubject.asObservable();
}

}
