import { Component, effect, ElementRef, inject, signal, viewChild } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { getUserAvatar, UserAvatarDetails } from '@core/helpers/getUserAvatar';
import { LoggerService } from '@core/services/logger.service';
import {
  ALLOWED_IMAGE_FORMATS,
  IMAGE_ACCEPT_FORMATS_STR,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} from '@shared/constants/avatar-config';
import { NotificationService } from '@core/notification/notification.service';
import { CloudinaryService } from '@core/services/cloudinary.service';
import { firstValueFrom } from 'rxjs';
import { Loader } from '@shared/loader/loader';

@Component({
  selector: 'app-profile',
  imports: [Loader],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private readonly userService = inject(UserService);
  private readonly logger = inject(LoggerService);
  private readonly notificator = inject(NotificationService);
  private readonly cloudinaryService = inject(CloudinaryService);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  currentUser = this.userService.userProfile;
  userAvatarDetails = signal<UserAvatarDetails | null>(null);
  photoLoading = signal(false);

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

  async onRemoveAvatar(): Promise<void> {
    try {
      await this.userService.updateUserProfile({ photoUrl: null });
    } catch (error) {
      this.logger.error(`Error while deleting avatar: ${error}`);
    }
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

    this.photoLoading.set(true);

    try {
      const uploadRes = await firstValueFrom(this.cloudinaryService.uploadImage(newPhoto));
      this.logger.info(`Cloudinary success: ${uploadRes.secure_url}`);

      await this.userService.updateUserProfile({ photoUrl: uploadRes.secure_url });
      this.notificator.success('Success', 'Avatar updated!');
    } catch (err) {
      this.logger.error(`Upload/Update photo failed: ${err}`);
      this.notificator.error('Error', 'Failed to update avatar');
    } finally {
      this.photoLoading.set(false);
      filesInput.value = '';
    }
  }
}
