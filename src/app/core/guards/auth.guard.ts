import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { LoggerService } from '../logger-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const logger = inject(LoggerService);
  const router = inject(Router);

  // Ждём, пока Firebase определит пользователя
  return new Promise<boolean>((resolve) => {
    const unsubscribe = authService.auth.onAuthStateChanged((user) => {
      authService.currentUser.set(user);
      logger.info(`User changed to: ${user?.email}`);
      unsubscribe();

      if (user) {
        resolve(true);
      } else {
        router.navigate(['/auth']);
        resolve(false);
      }
    });
  });
};
