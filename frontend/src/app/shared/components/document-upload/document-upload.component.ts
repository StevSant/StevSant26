import { Component, input, output, signal, inject, effect } from '@angular/core';
import { SupabaseService } from '@core/services/supabase.service';
import { SourceType } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

export interface ExistingDocument {
  id: number;
  url: string;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  label: string | null;
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './document-upload.component.html',
})
export class DocumentUploadComponent {
  private supabase = inject(SupabaseService);

  // Signal inputs
  folder = input<string>('');
  sourceType = input<SourceType | null>(null);
  sourceId = input<number | null>(null);
  existingDocuments = input<ExistingDocument[]>([]);

  // Signal outputs
  uploaded = output<{ path: string; url: string; file_name: string; file_type: string; file_size: number }>();
  documentDeleted = output<number>();

  // Internal signals
  uploading = signal(false);
  error = signal<string | null>(null);
  isDragging = signal(false);
  uploadedDocuments = signal<{ path: string; url: string; file_name: string; file_type: string; file_size: number }[]>([]);
  loadedExistingDocuments = signal<ExistingDocument[]>([]);

  private readonly MAX_SIZE = 20 * 1024 * 1024; // 20MB
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  constructor() {
    effect(() => {
      const existing = this.existingDocuments();
      if (existing.length > 0) {
        this.loadedExistingDocuments.set(existing);
      }
    });
  }

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
      input.value = '';
    }
  }

  private async processFiles(files: File[]): Promise<void> {
    this.error.set(null);

    for (const file of files) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.error.set(`Tipo de archivo no permitido: ${file.type}`);
        continue;
      }

      if (file.size > this.MAX_SIZE) {
        this.error.set(`El archivo es demasiado grande. Máximo 20MB.`);
        continue;
      }

      await this.uploadFile(file);
    }
  }

  private async uploadFile(file: File): Promise<void> {
    this.uploading.set(true);

    try {
      const folderPath = this.folder() || this.sourceType() || 'misc';
      const { path, error } = await this.supabase.uploadDocument(file, folderPath);

      if (error) throw error;

      if (path) {
        const url = this.supabase.getDocumentPublicUrl(path);
        const docData = {
          path,
          url,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
        };

        this.uploadedDocuments.update((docs) => [...docs, docData]);
        this.uploaded.emit(docData);
      }
    } catch (err) {
      this.error.set('Error al subir el documento. Por favor intenta de nuevo.');
      console.error('Upload error:', err);
    } finally {
      this.uploading.set(false);
    }
  }

  async removeUploadedDocument(path: string, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      await this.supabase.deleteDocumentFromStorage(path);
      this.uploadedDocuments.update((docs) => docs.filter((d) => d.path !== path));
    } catch (err) {
      this.error.set('Error al eliminar el documento.');
      console.error('Delete error:', err);
    }
  }

  async removeExistingDocument(documentId: number, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      await this.supabase.update('document', documentId, { is_archived: true });
      this.loadedExistingDocuments.update((docs) => docs.filter((d) => d.id !== documentId));
      this.documentDeleted.emit(documentId);
    } catch (err) {
      this.error.set('Error al eliminar el documento.');
      console.error('Delete error:', err);
    }
  }

  openDocument(url: string): void {
    window.open(url, '_blank');
  }

  getFileIcon(fileType: string | null): string {
    if (!fileType) return '📄';
    if (fileType.includes('pdf')) return '📕';
    if (fileType.includes('word') || fileType.includes('document')) return '📘';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📗';
    if (fileType.includes('powerpoint') || fileType.includes('presentation')) return '📙';
    if (fileType.includes('image')) return '🖼️';
    return '📄';
  }

  getFileExtension(fileName: string | null): string {
    if (!fileName) return '';
    const ext = fileName.split('.').pop();
    return ext ? ext.toUpperCase() : '';
  }

  formatFileSize(bytes: number | null): string {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}
