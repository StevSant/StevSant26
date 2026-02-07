import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Event, EventTranslation, Language } from '@core/models';
import { ImageUploadComponent, ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent, ExistingDocument } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { EventFormBaseInfoComponent } from './event-form-base-info/event-form-base-info.component';
import { EventFormTranslationsComponent } from './event-form-translations/event-form-translations.component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, EventFormBaseInfoComponent, EventFormTranslationsComponent],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent implements OnInit {
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
    assisted_at: '',
  };

  // Translations map by language code
  translations: Map<string, { name: string; description: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { name: string; description: string } {
    return this.translations.get(this.currentEditLanguage()) || { name: '', description: '' };
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
        this.translations.set(lang.code, { name: '', description: '' });
      }

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Event>(
          'event',
          'event_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            assisted_at: data.assisted_at?.split('T')[0] || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as EventTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  name: t.name || '',
                  description: t.description || '',
                });
              }
            }
          }

          // Load existing images
          const { data: images } = await this.supabase.getImagesBySource('event', this.currentId!);
          if (images) {
            this.existingImages.set(images as ExistingImage[]);
          }

          // Load existing documents
          const { data: documents } = await this.supabase.getDocumentsBySource('event', this.currentId!);
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

  updateTranslation(field: 'name' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { name: '', description: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    // Validate that at least one language has a name
    const hasName = Array.from(this.translations.values()).some((t) => t.name.trim());
    if (!hasName) {
      this.error.set('El nombre es requerido en al menos un idioma');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        assisted_at: this.formData.assisted_at || null,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        name: t.name || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'event',
          'event_translation',
          'event_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'event',
          'event_translation',
          'event_id',
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

      this.router.navigate(['/dashboard/events']);
    } catch (err) {
      this.error.set('Error al guardar el evento');
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
          source_type: 'event',
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
          source_type: 'event',
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
          source_type: 'event',
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
          source_type: 'event',
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
