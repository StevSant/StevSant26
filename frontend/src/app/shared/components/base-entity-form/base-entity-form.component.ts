import { OnInit, signal, inject, Directive, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { Language } from '@core/models';
import { ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { ExistingDocument } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { LoggerService } from '@core/services/logger.service';

/**
 * Abstract base class for all entity form components (project, experience, event, competition, education).
 * Extracts the common boilerplate: route parsing, signals, image/document pending queues,
 * translation map management, and submission flow.
 *
 * Subclasses must implement:
 * - getSourceType(): the polymorphic source type string
 * - getTableName(), getTranslationTableName(), getForeignKey(): DB metadata
 * - getNavigateBackPath(): where to go after save
 * - buildFormPayload(): build the base (non-translatable) payload
 * - buildTranslationsPayload(): build the translations array
 * - validateForm(): return error string or null
 * - initializeFormData(data): populate form fields from loaded entity
 * - initializeTranslations(translations): populate translation map from loaded translations
 * - getEmptyTranslation(): return an empty translation object for a new language
 */
@Directive()
export abstract class BaseEntityFormComponent<TEntity, TTranslation> implements OnInit {
  protected supabase = inject(SupabaseService);
  protected languageService = inject(LanguageService);
  protected t = inject(TranslateService);
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  protected logger = inject(LoggerService);

  // State signals
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

  // Translations map by language code
  translations: Map<string, TTranslation> = new Map();

  // Optional refs to child components (override with viewChild in subclass)
  protected skillUsageManager?: Signal<SkillUsageManagerComponent | undefined>;
  protected contentSectionManager?: Signal<ContentSectionManagerComponent | undefined>;

  // ==================== ABSTRACT METHODS ====================

  /** The polymorphic source_type (e.g. 'project', 'experience') */
  abstract getSourceType(): string;

  /** The DB table name (e.g. 'project') */
  abstract getTableName(): string;

  /** The DB translation table name (e.g. 'project_translation') */
  abstract getTranslationTableName(): string;

  /** The foreign key in the translation table (e.g. 'project_id') */
  abstract getForeignKey(): string;

  /** The route to navigate back to after save */
  abstract getNavigateBackPath(): string;

  /** Build the non-translatable payload from formData */
  abstract buildFormPayload(): Record<string, unknown>;

  /** Build the translations payload array */
  abstract buildTranslationsPayload(): { language: string;[key: string]: string | null }[];

  /** Validate the form. Return an error message string if invalid, null if valid. */
  abstract validateForm(): string | null;

  /** Populate form fields from loaded entity data */
  abstract initializeFormData(data: TEntity): void;

  /** Populate the translations map from loaded entity translations */
  abstract initializeTranslations(translations: TTranslation[]): void;

  /** Get an empty translation object for language initialization */
  abstract getEmptyTranslation(): TTranslation;

  // ==================== CONCRETE METHODS ====================

  /** Get available languages from service */
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  /** Get current translation being edited */
  get currentTranslation(): TTranslation {
    return this.translations.get(this.currentEditLanguage()) || this.getEmptyTranslation();
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
        this.translations.set(lang.code, this.getEmptyTranslation());
      }

      // Hook for subclass-specific extra loading (e.g. parent projects)
      await this.onBeforeLoadEntity();

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<TEntity>(
          this.getTableName(),
          this.getTranslationTableName(),
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.initializeFormData(data);

          // Load translations
          const translations = (data as Record<string, unknown>)['translations'] as TTranslation[] | undefined;
          if (translations) {
            this.initializeTranslations(translations);
          }

          // Load existing images
          const { data: images } = await this.supabase.getImagesBySource(this.getSourceType(), this.currentId!);
          if (images) {
            this.existingImages.set(images as ExistingImage[]);
          }

          // Load existing documents (if entity supports them)
          if (this.supportsDocuments()) {
            const { data: documents } = await this.supabase.getDocumentsBySource(this.getSourceType(), this.currentId!);
            if (documents) {
              this.existingDocuments.set(documents as ExistingDocument[]);
            }
          }
        }
      }
    } catch (err) {
      this.error.set(this.t.instant('errors.dataLoadFailed'));
      this.logger.error('Load error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /** Override in subclass to load extra data before entity (e.g. parent projects) */
  protected async onBeforeLoadEntity(): Promise<void> { }

  /** Override to return true if the entity supports document uploads */
  protected supportsDocuments(): boolean {
    return true;
  }

  setEditLanguage(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  async onSubmit(): Promise<void> {
    const validationError = this.validateForm();
    if (validationError) {
      this.error.set(validationError);
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = this.buildFormPayload();
      const translationsPayload = this.buildTranslationsPayload();

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          this.getTableName(),
          this.getTranslationTableName(),
          this.getForeignKey(),
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          this.getTableName(),
          this.getTranslationTableName(),
          this.getForeignKey(),
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;

      const entityId = this.isNew ? (result.data as { id: number })?.id : this.currentId!;
      if (entityId) {
        await this.savePendingImages(entityId);
        if (this.supportsDocuments()) {
          await this.savePendingDocuments(entityId);
        }
        const skillMgr = this.skillUsageManager?.();
        if (skillMgr?.hasPendingUsages()) {
          await skillMgr.savePendingUsages(entityId);
        }
        const contentMgr = this.contentSectionManager?.();
        if (contentMgr?.hasPendingItems()) {
          await contentMgr.savePendingItems(entityId);
        }
      }

      this.router.navigate([this.getNavigateBackPath()]);
    } catch (err) {
      this.error.set(this.getSaveErrorMessage());
      this.logger.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  /** Override to customize save error message */
  protected getSaveErrorMessage(): string {
    return this.t.instant('errors.saveFailed');
  }

  private async savePendingImages(entityId: number): Promise<void> {
    const images = this.pendingImages();
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      try {
        await this.supabase.create('image', {
          url: img.url,
          source_type: this.getSourceType(),
          source_id: entityId,
          position: i,
        });
      } catch (err) {
        this.logger.error('Error saving image:', err);
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
          source_type: this.getSourceType(),
          source_id: entityId,
          position: i,
        });
      } catch (err) {
        this.logger.error('Error saving document:', err);
      }
    }
    this.pendingDocuments.set([]);
  }

  async onImageUploaded(data: { path: string; url: string }): Promise<void> {
    if (this.currentId) {
      try {
        const currentImages = this.existingImages();
        await this.supabase.create('image', {
          url: data.url,
          source_type: this.getSourceType(),
          source_id: this.currentId,
          position: currentImages.length,
        });
      } catch (err) {
        this.logger.error('Error saving image:', err);
        this.error.set(this.t.instant('errors.imageSaveFailed'));
      }
    } else {
      this.pendingImages.update(images => [...images, data]);
    }
  }

  async onDocumentUploaded(data: { path: string; url: string; file_name: string; file_type: string; file_size: number }): Promise<void> {
    if (this.currentId) {
      try {
        const currentDocuments = this.existingDocuments();
        await this.supabase.create('document', {
          url: data.url,
          file_name: data.file_name,
          file_type: data.file_type,
          file_size: data.file_size,
          source_type: this.getSourceType(),
          source_id: this.currentId,
          position: currentDocuments.length,
        });
      } catch (err) {
        this.logger.error('Error saving document:', err);
        this.error.set(this.t.instant('errors.documentSaveFailed'));
      }
    } else {
      this.pendingDocuments.update(docs => [...docs, data]);
    }
  }

  async onImagesReordered(updates: { id: number; position: number }[]): Promise<void> {
    if (updates.length === 0) return;
    try {
      await this.supabase.updatePositions('image', updates);
      // Update local existing images to reflect new order
      const sorted = [...this.existingImages()].sort((a, b) => {
        const posA = updates.find(u => u.id === a.id)?.position ?? 0;
        const posB = updates.find(u => u.id === b.id)?.position ?? 0;
        return posA - posB;
      });
      this.existingImages.set(sorted);
    } catch (err) {
      this.logger.error('Error reordering images:', err);
      this.error.set(this.t.instant('errors.imageReorderFailed'));
    }
  }
}
