import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { LoggerService } from '../core/logger-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly logger = inject(LoggerService);
  readonly auth = inject(Auth);

  currentUser = signal<User | null>(null);

  async register(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    this.currentUser.set(result.user);
    this.logger.info(`New user registered: ${result.user.email}`);
    return result.user;
  }

  async login(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    this.currentUser.set(result.user);
    this.logger.info(`User logged in: ${result.user.email}`);
    return result.user;
  }

  async loginWithGoogle(): Promise<User> {
    const googleProvider = new GoogleAuthProvider();

    const result = await signInWithPopup(this.auth, googleProvider);
    this.currentUser.set(result.user);
    this.logger.info(`User logged in with Google: ${result.user.email}`);
    return result.user;
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    this.logger.info('User logged out');
    this.currentUser.set(null);
  }
}
