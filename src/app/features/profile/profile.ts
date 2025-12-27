import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { getUserAvatar, UserAvatarDetails } from '../../core/helpers/getUserAvatar';
import { LoggerService } from '../../core/services/logger.service';
import {
  ALLOWED_IMAGE_FORMATS,
  IMAGE_ACCEPT_FORMATS_STR,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '../../shared/constants/avatar-config';
import { NotificationService } from '../../core/notification/notification.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly userService = inject(UserService);
  private readonly logger = inject(LoggerService);
  private readonly notificator = inject(NotificationService);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  currentUser = this.userService.userProfile;
  userAvatarDetails = signal<UserAvatarDetails | null>(null);

  AVAILABLE_FORMATS = IMAGE_ACCEPT_FORMATS_STR;

  constructor() {
    effect(() => {
      const avatarData = getUserAvatar(this.currentUser());
      this.userAvatarDetails.set(avatarData);
    });
  }

  onAddAvatar(): void {
    this.fileInput()?.nativeElement.click();
  }

  onRemoveAvatar(): void {
    console.log('REMOVING');
  }

  async onFileSelected(event: Event): Promise<void> {
    const filesInput = event.target as HTMLInputElement;
    if (!filesInput.files?.length) return;

    const newPhoto = filesInput.files[0];

    if (!ALLOWED_IMAGE_FORMATS.includes(newPhoto.type)) {
      this.notificator.error(
        'Error',
        `Unsupported format: ${newPhoto.type}. Please use PNG, JPEG, WebP or AVIF.`,
      );
      filesInput.value = '';
      return;
    }

    if (newPhoto.size > MAX_FILE_SIZE_BYTES) {
      this.notificator.error('Error', `File is too heavy! Max size is ${MAX_FILE_SIZE_MB}MB.`);
      filesInput.value = '';
      return;
    }

    try {
      this.logger.info(`Selected file: ${newPhoto.name}`);
    } catch (error) {
      this.logger.error(`Upload failed: ${error}`);
    } finally {
      filesInput.value = '';
    }
  }
}
