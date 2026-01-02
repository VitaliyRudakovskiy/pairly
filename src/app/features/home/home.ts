import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Button } from '@shared/button/button';
import { NotificationService } from '@core/notification/notification.service';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['auth']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }

  notify(): void {
    this.notificationService.success('Hello', 'Very good, how do ypu feel?');
  }

  notifyI(): void {
    this.notificationService.info('Info', 'Very good, how do ypu feel?');
  }

  notifyW(): void {
    this.notificationService.warning('Warning', 'Very good, how do ypu feel?');
  }

  notifyE(): void {
    this.notificationService.error('error', 'Very good, how do ypu feel?');
  }
}
