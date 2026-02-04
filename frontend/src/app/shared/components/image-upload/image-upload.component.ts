import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';
import { SourceType } from '../../core/models';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-4">
      <!-- Upload Area -->
      <div
        class="relative border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors cursor-pointer"
        [class.border-blue-500]="isDragging()"
        [class.bg-blue-500/10]="isDragging()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <input
          #fileInput
          type="file"
          accept="image/*"
          [multiple]="multiple"
          class="hidden"
          (change)="onFileSelect($event)"
          [disabled]="uploading()"
        />

        <div class="text-center">
          @if (uploading()) {
            <div class="flex flex-col items-center gap-3">
              <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p class="text-gray-400">Subiendo imagen{{ uploadProgress() ? ' (' + uploadProgress() + '%)' : '...' }}</p>
            </div>
          } @else {
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="mt-2 text-sm text-gray-400">
              <span class="text-blue-500 font-medium">Haz clic para subir</span> o arrastra y suelta
            </p>
            <p class="mt-1 text-xs text-gray-500">PNG, JPG, GIF, WebP hasta 10MB</p>
          }
        </div>
      </div>

      <!-- Error Message -->
      @if (error()) {
        <div class="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
          <p class="text-red-400 text-sm">{{ error() }}</p>
        </div>
      }

      <!-- Preview -->
      @if (previewUrl()) {
        <div class="relative rounded-lg overflow-hidden bg-gray-700">
          <img [src]="previewUrl()" [alt]="altText || 'Preview'" class="w-full h-48 object-cover" />
          <button
            type="button"
            (click)="removeImage($event)"
            class="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      <!-- Uploaded Images Gallery -->
      @if (uploadedImages().length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (img of uploadedImages(); track img.path) {
            <div class="relative group rounded-lg overflow-hidden bg-gray-700">
              <img [src]="img.url" [alt]="img.alt || 'Uploaded image'" class="w-full h-32 object-cover" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  (click)="removeUploadedImage(img.path, $event)"
                  class="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ImageUploadComponent {
  @Input() folder: string = '';
  @Input() sourceType: SourceType | null = null;
  @Input() sourceId: number | null = null;
  @Input() multiple = false;
  @Input() altText = '';

  @Output() uploaded = new EventEmitter<{ path: string; url: string }>();
  @Output() removed = new EventEmitter<string>();

  uploading = signal(false);
  uploadProgress = signal<number | null>(null);
  error = signal<string | null>(null);
  isDragging = signal(false);
  previewUrl = signal<string | null>(null);
  uploadedImages = signal<{ path: string; url: string; alt?: string }[]>([]);

  private readonly MAX_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  constructor(private supabase: SupabaseService) {}

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

      if (!this.multiple) break;
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
      const folderPath = this.folder || this.sourceType || 'misc';

      // Upload to Supabase Storage
      const { path, error } = await this.supabase.uploadImage(file, folderPath);

      if (error) {
        throw error;
      }

      if (path) {
        const url = this.supabase.getPublicUrl(path);

        if (this.multiple) {
          this.uploadedImages.update((images) => [...images, { path, url, alt: this.altText }]);
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
}
