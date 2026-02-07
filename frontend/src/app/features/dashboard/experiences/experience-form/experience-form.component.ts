import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Experience, ExperienceTranslation, Language } from '@core/models';
import { ImageUploadComponent, ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent, ExistingDocument } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { ExperienceFormBaseInfoComponent } from './experience-form-base-info/experience-form-base-info.component';
import { ExperienceFormTranslationsComponent } from './experience-form-translations/experience-form-translations.component';

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, ExperienceFormBaseInfoComponent, ExperienceFormTranslationsComponent],
  templateUrl: './experience-form.component.html',
})
export class ExperienceFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('skillUsageManager') skillUsageManager!: SkillUsageManagerComponent;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Pending images to save after entity creation
  pendingImages = signal<{ path: string; url: string }[]>([]);

  // Existing images loaded from database
  existingImages = signal<ExistingImage[]>([]);

  // Pending documents to save after entity creation
  pendingDocuments = signal<{ path: string; url: string; file_name: string; file_type: string; file_size: number }[]>([]);

  // Existing documents loaded from database
  existingDocuments = signal<ExistingDocument[]>([]);

  // Base fields (non-translatable)
  formData = {
    company: '',
    start_date: '',
    end_date: '',
    company_image_url: '',
  };

  // Translations map by language code
  translations: Map<string, { role: string; description: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { role: string; description: string } {
    return this.translations.get(this.currentEditLanguage()) || { role: '', description: '' };
  }

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.currentId = parseInt(id, 10);
    }
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      // Initialize empty translations for all languages
      for (const lang of this.supportedLanguages) {
        this.translations.set(lang.code, { role: '', description: '' });
      }

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Experience>(
          'experience',
          'experience_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            company: data.company || '',
            start_date: data.start_date?.split('T')[0] || '',
            end_date: data.end_date?.split('T')[0] || '',
            company_image_url: data.company_image_url || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as ExperienceTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  role: t.role || '',
                  description: t.description || '',
                });
              }
            }
          }

          // Load existing images
          const { data: images } = await this.supabase.getImagesBySource('experience', this.currentId!);
          if (images) {
            this.existingImages.set(images as ExistingImage[]);
          }

          // Load existing documents
          const { data: documents } = await this.supabase.getDocumentsBySource('experience', this.currentId!);
          if (documents) {
            this.existingDocuments.set(documents as ExistingDocument[]);
          }
        }
      }
    } catch (err) {
      this.error.set('Error al cargar los datos');
      console.error('Load error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  setEditLanguage(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  updateTranslation(field: 'role' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { role: '', description: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    // Validate that company is provided and at least one language has a role
    if (!this.formData.company.trim()) {
      this.error.set('La empresa es requerida');
      return;
    }

    const hasRole = Array.from(this.translations.values()).some((t) => t.role.trim());
    if (!hasRole) {
      this.error.set('El rol es requerido en al menos un idioma');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        company: this.formData.company,
        start_date: this.formData.start_date || null,
        end_date: this.formData.end_date || null,
        company_image_url: this.formData.company_image_url || null,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        role: t.role || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'experience',
          'experience_translation',
          'experience_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'experience',
          'experience_translation',
          'experience_id',
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;

      // Save pending images and skill usages after entity creation
      const entityId = this.isNew ? (result.data as { id: number })?.id : this.currentId!;
      if (entityId) {
        await this.savePendingImages(entityId);
        await this.savePendingDocuments(entityId);
        // Save pending skill usages
        if (this.skillUsageManager?.hasPendingUsages()) {
          await this.skillUsageManager.savePendingUsages(entityId);
        }
      }

      this.router.navigate(['/dashboard/experiences']);
    } catch (err) {
      this.error.set('Error al guardar la experiencia');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  private async savePendingImages(entityId: number): Promise<void> {
    const images = this.pendingImages();
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        await this.supabase.create('image', {
          url: img.url,
          source_type: 'experience',
          source_id: entityId,
          position: i,
        });
      } catch (err) {
        console.error('Error saving image:', err);
      }
    }
    this.pendingImages.set([]);
  }

  private async savePendingDocuments(entityId: number): Promise<void> {
    const documents = this.pendingDocuments();
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      try {
        await this.supabase.create('document', {
          url: doc.url,
          file_name: doc.file_name,
          file_type: doc.file_type,
          file_size: doc.file_size,
          source_type: 'experience',
          source_id: entityId,
          position: i,
        });
      } catch (err) {
        console.error('Error saving document:', err);
      }
    }
    this.pendingDocuments.set([]);
  }

  async onDocumentUploaded(data: { path: string; url: string; file_name: string; file_type: string; file_size: number }): Promise<void> {
    if (this.currentId) {
      try {
        await this.supabase.create('document', {
          url: data.url,
          file_name: data.file_name,
          file_type: data.file_type,
          file_size: data.file_size,
          source_type: 'experience',
          source_id: this.currentId,
          position: 0,
        });
      } catch (err) {
        console.error('Error saving document:', err);
        this.error.set('Error al guardar el documento');
      }
    } else {
      this.pendingDocuments.update(docs => [...docs, data]);
    }
  }

  async onImageUploaded(data: { path: string; url: string }): Promise<void> {
    if (this.currentId) {
      // If editing existing entity, save immediately
      try {
        await this.supabase.create('image', {
          url: data.url,
          source_type: 'experience',
          source_id: this.currentId,
          position: 0,
        });
      } catch (err) {
        console.error('Error saving image:', err);
        this.error.set('Error al guardar la imagen');
      }
    } else {
      // Queue for saving after entity creation
      this.pendingImages.update(images => [...images, data]);
    }
  }
}
