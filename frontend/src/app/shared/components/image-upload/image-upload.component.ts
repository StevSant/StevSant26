import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { SourceType } from '@core/models';
import { ImageUploadAvatarComponent } from './image-upload-avatar/image-upload-avatar.component';
import { ImageUploadBannerComponent } from './image-upload-banner/image-upload-banner.component';
import { ImageUploadStandardComponent } from './image-upload-standard/image-upload-standard.component';
import { ImageUploadGalleryComponent } from './image-upload-gallery/image-upload-gallery.component';
import { ImageUploadModalComponent } from './image-upload-modal/image-upload-modal.component';

export interface ExistingImage {
  id: number;
  url: string;
  alt_text?: string | null;
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [
    ImageUploadAvatarComponent,
    ImageUploadBannerComponent,
    ImageUploadStandardComponent,
    ImageUploadGalleryComponent,
    ImageUploadModalComponent,
  ],
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent {
  private supabase = inject(SupabaseService);

  // Signal inputs
  folder = input<string>('');
  sourceType = input<SourceType | null>(null);
  sourceId = input<number | null>(null);
  multiple = input<boolean>(false);
  altText = input<string>('');
  isAvatar = input<boolean>(false);
  isBanner = input<boolean>(false);
  existingImageUrl = input<string | null>(null);
  existingImageId = input<number | null>(null);
  existingImages = input<ExistingImage[]>([]);

  // Signal outputs
  uploaded = output<{ path: string; url: string }>();
  removed = output<string>();
  imageDeleted = output<number>();
  existingImageRemoved = output<number>();

  // Internal signals
  uploading = signal(false);
  uploadProgress = signal<number | null>(null);
  error = signal<string | null>(null);
  isDragging = signal(false);
  previewUrl = signal<string | null>(null);
  uploadedImages = signal<{ path: string; url: string; alt?: string }[]>([]);
  showModal = signal(false);

  // Track loaded existing images to display them
  loadedExistingImages = signal<ExistingImage[]>([]);

  constructor() {
    // Effect to sync existingImages input with internal signal
    effect(() => {
      const existing = this.existingImages();
      if (existing.length > 0) {
        this.loadedExistingImages.set(existing);
      }
    });
  }

  // Computed
  currentImageUrl = computed(() => this.previewUrl() || this.existingImageUrl());

  private readonly MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.processFiles(Array.from(input.files));
      input.value = ''; // Reset input
    }
  }

  private async processFiles(files: File[]): Promise<void> {
    this.error.set(null);

    for (const file of files) {
      // Validate file type
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.error.set(`Tipo de archivo no permitido: ${file.type}`);
        continue;
      }

      // Validate file size
      if (file.size > this.MAX_SIZE) {
        this.error.set(`El archivo es demasiado grande. Máximo 10MB.`);
        continue;
      }

      await this.uploadFile(file);

      if (!this.multiple()) break;
    }
  }

  private async uploadFile(file: File): Promise<void> {
    this.uploading.set(true);
    this.uploadProgress.set(null);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Determine folder path
      const folderPath = this.folder() || this.sourceType() || 'misc';

      // Upload to Supabase Storage
      const { path, error } = await this.supabase.uploadFile(file, folderPath);

      if (error) {
        throw error;
      }

      if (path) {
        const url = this.supabase.getPublicUrl(path);

        if (this.multiple()) {
          this.uploadedImages.update((images) => [...images, { path, url, alt: this.altText() }]);
          this.previewUrl.set(null);
        }

        this.uploaded.emit({ path, url });
      }
    } catch (err) {
      this.error.set('Error al subir la imagen. Por favor intenta de nuevo.');
      this.previewUrl.set(null);
      console.error('Upload error:', err);
    } finally {
      this.uploading.set(false);
      this.uploadProgress.set(null);
    }
  }

  removeImage(event: Event): void {
    event.stopPropagation();
    this.previewUrl.set(null);
  }

  async removeUploadedImage(path: string, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      await this.supabase.deleteFromStorage(path);
      this.uploadedImages.update((images) => images.filter((img) => img.path !== path));
      this.removed.emit(path);
    } catch (err) {
      this.error.set('Error al eliminar la imagen.');
      console.error('Delete error:', err);
    }
  }

  async removeExistingImage(imageId: number, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      // Delete from the image table (soft delete by archiving)
      await this.supabase.update('image', imageId, { is_archived: true });
      this.loadedExistingImages.update((images) => images.filter((img) => img.id !== imageId));
      this.imageDeleted.emit(imageId);
    } catch (err) {
      this.error.set('Error al eliminar la imagen.');
      console.error('Delete error:', err);
    }
  }

  openImageModal(event: Event): void {
    event.stopPropagation();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onModalBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  // --- Sub-component event handlers ---

  onOpenImageModal(): void {
    this.showModal.set(true);
  }

  onRemovePreview(): void {
    // If there's a preview, just clear it
    if (this.previewUrl()) {
      this.previewUrl.set(null);
      return;
    }

    // If there's an existing image with ID, emit event to archive it in database
    const existingId = this.existingImageId();
    if (existingId) {
      this.existingImageRemoved.emit(existingId);
    }
  }

  processDroppedFiles(files: File[]): void {
    this.processFiles(files);
  }

  async onGalleryRemoveUploaded(path: string): Promise<void> {
    try {
      await this.supabase.deleteFromStorage(path);
      this.uploadedImages.update((images) => images.filter((img) => img.path !== path));
      this.removed.emit(path);
    } catch (err) {
      this.error.set('Error al eliminar la imagen.');
      console.error('Delete error:', err);
    }
  }

  async onGalleryRemoveExisting(imageId: number): Promise<void> {
    try {
      await this.supabase.update('image', imageId, { is_archived: true });
      this.loadedExistingImages.update((images) => images.filter((img) => img.id !== imageId));
      this.imageDeleted.emit(imageId);
    } catch (err) {
      this.error.set('Error al eliminar la imagen.');
      console.error('Delete error:', err);
    }
  }
}
