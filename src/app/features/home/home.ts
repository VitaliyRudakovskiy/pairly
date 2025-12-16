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

  toggleLoading() {
    this.loading.update((l) => !l);
  }

  showS() {
    this.notificator.success('Success', 'Тут будет текст успешного уведомления');
  }

  showI() {
    this.notificator.info('Info', 'Тут будет текст информационного уведомления');
  }

  showW() {
    this.notificator.warning('Warning', 'Тут будет текст предупреждения');
  }

  showE() {
    this.notificator.error('Error', 'Тут будет текст ошибки');
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['auth']);
    } catch (err) {
      console.error('Logout failed', err);
    }
  }
}
