import { signal } from '@angular/core';
import { TranslationDataService } from '@core/services/translation-data.service';
import { CrudService } from '@core/services/crud.service';
import { TranslateService } from '@core/services/translate.service';

/**
 * Manages a single profile image type (avatar or banner).
 * Encapsulates pending/existing state and CRUD operations.
 */
export class ProfileImageManager {
  readonly pending = signal<{ path: string; url: string } | null>(null);
  readonly existingUrl = signal<string | null>(null);
  readonly existingId = signal<number | null>(null);

  constructor(
    private translationData: TranslationDataService,
    private crud: CrudService,
    private t: TranslateService,
    private sourceType: string,
    private altText: string,
  ) {}

  /** Load existing image from the database */
  async load(): Promise<void> {
    const { data } = await this.translationData.getImagesBySourceType(this.sourceType);
    if (data && data.length > 0) {
      this.existingUrl.set(data[0].url);
      this.existingId.set(data[0].id);
    } else {
      this.existingUrl.set(null);
      this.existingId.set(null);
    }
  }

  /** Save the pending image to the database */
  async savePending(): Promise<void> {
    const img = this.pending();
    if (!img) return;

    const result = await this.crud.create('image', {
      url: img.url,
      source_type: this.sourceType,
      alt_text: this.altText,
      position: 0,
    });
    if (result.error) throw result.error;

    this.existingUrl.set(img.url);
    this.pending.set(null);
  }

  /**
   * Handle an image upload.
   * If the profile exists, saves immediately (archiving old image).
   * Otherwise, queues for later.
   */
  async onUploaded(
    data: { path: string; url: string },
    profileExists: boolean,
  ): Promise<{ success: string } | null> {
    if (profileExists) {
      const existingId = this.existingId();
      if (existingId) {
        await this.crud.update('image', existingId, { is_archived: true });
      }
      const result = await this.crud.create('image', {
        url: data.url,
        source_type: this.sourceType,
        alt_text: this.altText,
        position: 0,
      });
      if (result.error) throw result.error;

      this.existingUrl.set(data.url);
      this.existingId.set(result.data?.id ?? null);
      return { success: this.t.instant('success.imageUpdated', { name: this.altText }) };
    } else {
      this.pending.set(data);
      this.existingUrl.set(data.url);
      return null;
    }
  }

  /** Archive (soft-delete) the image */
  async onRemoved(imageId: number): Promise<string> {
    await this.crud.update('image', imageId, { is_archived: true });
    this.existingUrl.set(null);
    this.existingId.set(null);
    return this.t.instant('success.imageDeleted', { name: this.altText });
  }

  /** Reset state */
  reset(): void {
    this.pending.set(null);
  }
}
