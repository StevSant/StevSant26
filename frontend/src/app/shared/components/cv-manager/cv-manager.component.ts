import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { CvDocument, Language } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-cv-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './cv-manager.component.html',
})
export class CvManagerComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);

  cvDocuments = signal<CvDocument[]>([]);
  uploading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  // Form for new CV
  newCvLabel = '';
  newCvLanguageId: number | null = null;

  private readonly MAX_SIZE = 15 * 1024 * 1024; // 15MB
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
    const userId = this.supabase.user()?.id;
    if (!userId) return;

    const { data, error } = await this.supabase
      .from('cv_document')
      .select('*, language:language(*)')
      .eq('profile_id', userId)
      .order('position', { ascending: true });

    if (data) {
      this.cvDocuments.set(data as CvDocument[]);
    }
    if (error) {
      console.error('Error loading CV documents:', error);
    }
  }

  async onFileSelect(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    input.value = '';

    // Validate
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.error.set('Solo se permiten archivos PDF o Word (.doc, .docx)');
      return;
    }
    if (file.size > this.MAX_SIZE) {
      this.error.set('El archivo es demasiado grande. Máximo 15MB.');
      return;
    }

    this.uploading.set(true);
    this.error.set(null);

    try {
      // Upload file to storage
      const { path, error: uploadError } = await this.supabase.uploadFile(file, 'cv');
      if (uploadError || !path) throw uploadError || new Error('Upload failed');

      const url = this.supabase.getPublicUrl(path);
      const userId = this.supabase.user()?.id;
      if (!userId) throw new Error('Not authenticated');

      // Create cv_document record
      const { error: insertError } = await this.supabase.from('cv_document').insert({
        profile_id: userId,
        url,
        file_name: file.name,
        label: this.newCvLabel || null,
        language_id: this.newCvLanguageId || null,
        position: this.cvDocuments().length,
      });

      if (insertError) throw insertError;

      // Reset form
      this.newCvLabel = '';
      this.newCvLanguageId = null;

      await this.loadCvDocuments();
      this.success.set('CV subido correctamente');
      setTimeout(() => this.success.set(null), 3000);
    } catch (err) {
      this.error.set('Error al subir el CV');
      console.error('CV upload error:', err);
    } finally {
      this.uploading.set(false);
    }
  }

  async deleteCv(cv: CvDocument): Promise<void> {
    if (!confirm('¿Eliminar este CV?')) return;

    try {
      // Extract storage path from URL to delete the file
      const urlParts = cv.url.split('/storage/v1/object/public/');
      if (urlParts.length > 1) {
        const storagePath = urlParts[1].split('/').slice(1).join('/');
        await this.supabase.deleteFromStorage(storagePath);
      }

      // Delete the record
      await this.supabase.from('cv_document').delete().eq('id', cv.id);

      await this.loadCvDocuments();
      this.success.set('CV eliminado');
      setTimeout(() => this.success.set(null), 3000);
    } catch (err) {
      this.error.set('Error al eliminar el CV');
      console.error('CV delete error:', err);
    }
  }

  getLanguageName(cv: CvDocument): string {
    return cv.language?.name || '';
  }

  getDisplayName(cv: CvDocument): string {
    const parts: string[] = [];
    if (cv.label) parts.push(cv.label);
    if (cv.language?.name) parts.push(cv.language.name);
    if (parts.length > 0) return parts.join(' — ');
    return cv.file_name || 'CV';
  }
}
