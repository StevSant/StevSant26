import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

export interface PersonalInfoData {
  first_name: string;
  last_name: string;
  nickname: string;
}

@Component({
  selector: 'app-personal-info-card',
  standalone: true,
  imports: [FormsModule, ImageUploadComponent, TranslatePipe],
  templateUrl: './personal-info-card.component.html',
})
export class PersonalInfoCardComponent {
  /** Current personal info form data */
  formData = input.required<PersonalInfoData>();

  /** Existing avatar URL loaded from database */
  existingAvatarUrl = input<string | null>(null);

  /** Existing avatar ID for deletion */
  existingAvatarId = input<number | null>(null);

  /** Existing banner URL loaded from database */
  existingBannerUrl = input<string | null>(null);

  /** Existing banner ID for deletion */
  existingBannerId = input<number | null>(null);

  /** Emitted when avatar is uploaded */
  avatarUploaded = output<{ path: string; url: string }>();

  /** Emitted when avatar is removed */
  avatarRemoved = output<number>();

  /** Emitted when banner is uploaded */
  bannerUploaded = output<{ path: string; url: string }>();

  /** Emitted when banner is removed */
  bannerRemoved = output<number>();

  /** Emitted when any personal info field changes */
  formDataChange = output<PersonalInfoData>();

  onFieldChange(): void {
    this.formDataChange.emit({ ...this.formData() });
  }

  onAvatarUploaded(data: { path: string; url: string }): void {
    this.avatarUploaded.emit(data);
  }

  onAvatarRemoved(imageId: number): void {
    this.avatarRemoved.emit(imageId);
  }

  onBannerUploaded(data: { path: string; url: string }): void {
    this.bannerUploaded.emit(data);
  }

  onBannerRemoved(imageId: number): void {
    this.bannerRemoved.emit(imageId);
  }
}
