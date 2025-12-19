import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Button } from '../../ui/button/button';
import { CloudinaryService } from '../../core/cloudinary.service';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly cloudinary = inject(CloudinaryService);
  private readonly router = inject(Router);

  onFile(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    this.cloudinary.uploadImage(file).subscribe({
      next: (res) => {
        console.log('Uploaded:', res.secure_url);
      },
      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['auth']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
}
