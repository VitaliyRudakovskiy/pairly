import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth-service';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Button } from '../../ui/button/button';

@Component({
  selector: 'app-home',
  imports: [JsonPipe, Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loading = signal(false);

  toggleLoading() {
    this.loading.update((l) => !l);
  }

  currentUser = this.authService.currentUser;

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['auth']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
}
