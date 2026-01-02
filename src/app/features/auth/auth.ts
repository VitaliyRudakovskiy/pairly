import { Component, inject, signal } from '@angular/core';
import { email, Field, form, maxLength, minLength, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/notification/notification.service';
import { Button } from '@shared/button/button';
import { Card } from '@shared/card/card';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'app-auth',
  imports: [Field, Button, Card],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private readonly authService = inject(AuthService);
  private readonly notificator = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  private readonly router = inject(Router);

  isLoginForm = signal(true);
  isPasswordVisible = signal(false);
  loading = signal(false);
  defaultErrorMessage = signal('Something went wrong. Please try again.');
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 6, { message: 'Password must have at least 6 symbols' });
    maxLength(schemaPath.password, 50, { message: 'Password is too long' });
  });

  async signInApp(): Promise<void> {
    if (!this.loginForm().valid()) return;

    const callMethod = this.isLoginForm()
      ? this.authService.login.bind(this.authService)
      : this.authService.register.bind(this.authService);

    try {
      this.loading.set(true);
      await callMethod(this.loginModel().email, this.loginModel().password);
      this.router.navigate(['']);
    } catch (err: unknown) {
      this.logger.error('Auth error: ' + err);

      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code: string }).code;
        this.defaultErrorMessage.set(this.getErrorMessage(code));
      }

      this.notificator.error('Error', this.defaultErrorMessage());
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['']);
    } catch (err: unknown) {
      this.logger.error('Auth error with Google: ' + err);

      if (err && typeof err === 'object' && 'code' in err) {
        const code = (err as { code: string }).code;
        this.defaultErrorMessage.set(this.getErrorMessage(code));
      }

      this.notificator.error('Error', this.defaultErrorMessage());
    }
  }

  toggleForm(): void {
    this.isLoginForm.update((f) => !f);
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Incorrect email or password.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'No internet connection. Please check your network.';
      default:
        this.logger.error('Unknown auth error:' + code);
        return 'Something went wrong. Please try again.';
    }
  }
}
