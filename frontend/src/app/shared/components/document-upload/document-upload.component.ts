import { Component, input, output, signal, inject, effect } from '@angular/core';
import { NgClass, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentStorageService } from '@core/services/document-storage.service';
import { CrudService } from '@core/services/crud.service';
import { TranslationDataService } from '@core/services/translation-data.service';
import { TranslateService } from '@core/services/translate.service';
import { LanguageService } from '@core/services/language.service';
import { SourceType, Language } from '@core/models';
import { MAX_DOCUMENT_SIZE_BYTES } from '@shared/config/constants';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LoggerService } from '@core/services/logger.service';

import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';

export interface ExistingDocumentTranslation {
  id?: number;
  document_id?: number;
  language_id?: number;
  label: string | null;
  description: string | null;
  language?: Language;
}

export interface ExistingDocument {
  id: number;
  url: string;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  label: string | null;
  translations?: ExistingDocumentTranslation[];
}

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [NgClass, FormsModule, TranslatePipe, UpperCasePipe, LanguageTabsComponent],
  templateUrl: './document-upload.component.html',
})
export class DocumentUploadComponent {
  private documentStorage = inject(DocumentStorageService);
  private crud = inject(CrudService);
  private translationData = inject(TranslationDataService);
  private t = inject(TranslateService);
  private languageService = inject(LanguageService);
  private logger = inject(LoggerService);

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

  // Translation editing
  expandedDocId = signal<number | null>(null);
  editingTranslations = signal<Map<string, { label: string; description: string }>>(new Map());
  savingTranslation = signal(false);
  currentDocLang = signal<string>('es');

  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  private readonly MAX_SIZE = MAX_DOCUMENT_SIZE_BYTES;
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
        this.error.set(this.t.instant('errors.fileTypeNotAllowed', { type: file.type }));
        continue;
      }

      if (file.size > this.MAX_SIZE) {
        this.error.set(this.t.instant('errors.fileTooLarge', { max: '20MB' }));
        continue;
      }

      await this.uploadFile(file);
    }
  }

  private async uploadFile(file: File): Promise<void> {
    this.uploading.set(true);

    try {
      const folderPath = this.folder() || this.sourceType() || 'misc';
      const { path, error } = await this.documentStorage.uploadDocument(file, folderPath);

      if (error) throw error;

      if (path) {
        const url = this.documentStorage.getDocumentPublicUrl(path);
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
      this.error.set(this.t.instant('errors.documentUploadFailed'));
      this.logger.error('Upload error:', err);
    } finally {
      this.uploading.set(false);
    }
  }

  async removeUploadedDocument(path: string, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      await this.documentStorage.deleteDocumentFromStorage(path);
      this.uploadedDocuments.update((docs) => docs.filter((d) => d.path !== path));
    } catch (err) {
      this.error.set(this.t.instant('errors.documentDeleteFailed'));
      this.logger.error('Delete error:', err);
    }
  }

  async removeExistingDocument(documentId: number, event: Event): Promise<void> {
    event.stopPropagation();

    try {
      await this.crud.update('document', documentId, { is_archived: true });
      this.loadedExistingDocuments.update((docs) => docs.filter((d) => d.id !== documentId));
      this.documentDeleted.emit(documentId);
    } catch (err) {
      this.error.set(this.t.instant('errors.documentDeleteFailed'));
      this.logger.error('Delete error:', err);
    }
  }

  openDocument(url: string): void {
    window.open(url, '_blank');
  }

  toggleTranslationEdit(doc: ExistingDocument): void {
    if (this.expandedDocId() === doc.id) {
      this.expandedDocId.set(null);
      return;
    }

    // Initialize editing map from existing translations
    const map = new Map<string, { label: string; description: string }>();
    for (const lang of this.supportedLanguages) {
      const existing = doc.translations?.find(t => t.language?.code === lang.code);
      map.set(lang.code, {
        label: existing?.label || '',
        description: existing?.description || '',
      });
    }
    this.editingTranslations.set(map);
    this.expandedDocId.set(doc.id);
  }

  getEditingTranslation(langCode: string): { label: string; description: string } {
    return this.editingTranslations().get(langCode) || { label: '', description: '' };
  }

  updateEditingTranslation(langCode: string, field: 'label' | 'description', value: string): void {
    const map = new Map(this.editingTranslations());
    const current = map.get(langCode) || { label: '', description: '' };
    map.set(langCode, { ...current, [field]: value });
    this.editingTranslations.set(map);
  }

  async saveDocumentTranslations(docId: number): Promise<void> {
    this.savingTranslation.set(true);
    try {
      for (const [langCode, fields] of this.editingTranslations()) {
        await this.translationData.upsertTranslation(
          'document_translation',
          'document_id',
          docId,
          { language: langCode, label: fields.label || null, description: fields.description || null }
        );
      }

      // Update the local existing documents to reflect saved translations
      this.loadedExistingDocuments.update(docs =>
        docs.map(d => {
          if (d.id !== docId) return d;
          const updatedTranslations: ExistingDocumentTranslation[] = [];
          for (const [langCode, fields] of this.editingTranslations()) {
            const lang = this.supportedLanguages.find(l => l.code === langCode);
            updatedTranslations.push({
              document_id: docId,
              label: fields.label || null,
              description: fields.description || null,
              language: lang,
            });
          }
          return { ...d, translations: updatedTranslations };
        })
      );

      this.expandedDocId.set(null);
    } catch (err) {
      this.error.set(this.t.instant('errors.saveFailed'));
      this.logger.error('Error saving document translations:', err);
    } finally {
      this.savingTranslation.set(false);
    }
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
