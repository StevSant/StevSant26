import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { Document, Language } from '@core/models';
import { MAX_CV_SIZE_BYTES, SUCCESS_MESSAGE_DURATION_MS } from '@shared/config/constants';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-cv-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './cv-manager.component.html',
})
export class CvManagerComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private t = inject(TranslateService);
  private logger = inject(LoggerService);

  cvDocuments = signal<Document[]>([]);
  uploading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Form for new CV
  newCvLabel = '';
  newCvLanguageId: number | null = null;

  private readonly MAX_SIZE = MAX_CV_SIZE_BYTES;
  private readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  async ngOnInit(): Promise<void> {
    await this.loadCvDocuments();
  }

  async loadCvDocuments(): Promise<void> {
    const { data, error } = await this.supabase
      .from('document')
      .select('*, language:language(*)')
      .eq('source_type', 'profile')
      .eq('is_archived', false)
      .order('position', { ascending: true });

    if (data) {
      this.cvDocuments.set(data as Document[]);
    }
    if (error) {
      this.logger.error('Error loading CV documents:', error);
    }
  }

  async onFileSelect(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    input.value = '';

    // Validate
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.error.set(this.t.instant('errors.cvInvalidFileType'));
      return;
    }
    if (file.size > this.MAX_SIZE) {
      this.error.set(this.t.instant('errors.fileTooLarge', { max: '15MB' }));
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    try {
      // Upload file to documents storage bucket
      const { path, error: uploadError } = await this.supabase.uploadDocument(file, 'cv');
      if (uploadError || !path) throw uploadError || new Error('Upload failed');

      const url = this.supabase.getDocumentPublicUrl(path);

      // Create document record with source_type = 'profile'
      const { error: insertError } = await this.supabase.from('document').insert({
        source_type: 'profile',
        url,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        label: this.newCvLabel || null,
        language_id: this.newCvLanguageId || null,
        position: this.cvDocuments().length,
      });

      if (insertError) throw insertError;

      // Reset form
      this.newCvLabel = '';
      this.newCvLanguageId = null;

      await this.loadCvDocuments();
      this.success.set(this.t.instant('success.cvUploaded'));
      setTimeout(() => this.success.set(null), SUCCESS_MESSAGE_DURATION_MS);
    } catch (err) {
      this.error.set(this.t.instant('errors.cvUploadFailed'));
      this.logger.error('CV upload error:', err);
    } finally {
      this.uploading.set(false);
    }
  }

  async deleteCv(cv: Document): Promise<void> {
    if (!confirm(this.t.instant('confirmDialog.deleteCv'))) return;

    try {
      // Extract storage path from URL to delete the file from documents bucket
      const urlParts = cv.url.split('/storage/v1/object/public/documents/');
      if (urlParts.length > 1) {
        const storagePath = urlParts[1];
        await this.supabase.deleteDocumentFromStorage(storagePath);
      }

      // Delete the record
      await this.supabase.from('document').delete().eq('id', cv.id);

      await this.loadCvDocuments();
      this.success.set(this.t.instant('success.cvDeleted'));
      setTimeout(() => this.success.set(null), SUCCESS_MESSAGE_DURATION_MS);
    } catch (err) {
      this.error.set(this.t.instant('errors.cvDeleteFailed'));
      this.logger.error('CV delete error:', err);
    }
  }

  getLanguageName(cv: Document): string {
    return cv.language?.name || '';
  }

  getDisplayName(cv: Document): string {
    const parts: string[] = [];
    if (cv.label) parts.push(cv.label);
    if (cv.language?.name) parts.push(cv.language.name);
    if (parts.length > 0) return parts.join(' — ');
    return cv.file_name || 'CV';
  }
}
