import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth-service';
import { Router } from '@angular/router';
import { Button } from '../../ui/button/button';
import { NotificationService } from '../../core/notification/notification.service';

@Component({
  selector: 'app-home',
  imports: [Button],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificator = inject(NotificationService);

  loading = signal(false);

  toggleLoading(): void {
    this.loading.update((l) => !l);
  }

  showS(): void {
    this.notificator.success('Success', 'Тут будет текст успешного уведомления');
  }

  showI(): void {
    this.notificator.info('Info', 'Тут будет текст информационного уведомления');
  }

  showW(): void {
    this.notificator.warning('Warning', 'Тут будет текст предупреждения');
  }

  showE(): void {
    this.notificator.error('Error', 'Тут будет текст ошибки');
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
