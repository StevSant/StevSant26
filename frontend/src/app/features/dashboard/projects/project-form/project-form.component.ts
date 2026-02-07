import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Project, ProjectTranslation, Language, getTranslation } from '@core/models';
import { ImageUploadComponent, ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { ProjectFormBaseInfoComponent } from './project-form-base-info/project-form-base-info.component';
import { ProjectFormTranslationsComponent } from './project-form-translations/project-form-translations.component';
import { ProjectFormAssociationComponent } from './project-form-association/project-form-association.component';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    ImageUploadComponent,
    SkillUsageManagerComponent,
    ContentSectionManagerComponent,
    FormHeaderComponent,
    LoadingSpinnerComponent,
    FormActionsComponent,
    ProjectFormBaseInfoComponent,
    ProjectFormTranslationsComponent,
    ProjectFormAssociationComponent,
  ],
  templateUrl: './project-form.component.html',
})
export class ProjectFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('skillUsageManager') skillUsageManager!: SkillUsageManagerComponent;
  @ViewChild('contentSectionManager') contentSectionManager!: ContentSectionManagerComponent;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  parentProjects = signal<Project[]>([]);

  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Pending images to save after entity creation
  pendingImages = signal<{ path: string; url: string }[]>([]);

  // Existing images loaded from database
  existingImages = signal<ExistingImage[]>([]);

  // Base fields (non-translatable)
  formData = {
    url: '',
    created_at: new Date().toISOString().split('T')[0],
    parent_project_id: null as number | null,
    source_id: null as number | null,
    source_type: null as string | null,
  };

  // Translations map by language code
  translations: Map<string, { title: string; description: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { title: string; description: string } {
    return this.translations.get(this.currentEditLanguage()) || { title: '', description: '' };
  }

  // Helper to get project title from translations
  getProjectTitle(project: Project): string {
    const translation = getTranslation(project.translations, this.translateService.currentLang());
    return translation?.title || `Project #${project.id}`;
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
        this.translations.set(lang.code, { title: '', description: '' });
      }

      // Load parent projects (exclude current if editing)
      const { data: projects } = await this.supabase.getActive<Project>('project');
      if (projects) {
        this.parentProjects.set(
          this.currentId ? projects.filter((p) => p.id !== this.currentId) : projects
        );
      }

      // Load current item if editing
      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Project>(
          'project',
          'project_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            url: data.url || '',
            created_at: data.created_at?.split('T')[0] || '',
            parent_project_id: data.parent_project_id,
            source_id: data.source_id,
            source_type: data.source_type,
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as ProjectTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  title: t.title || '',
                  description: t.description || '',
                });
              }
            }
          }

          // Load existing images
          const { data: images } = await this.supabase.getImagesBySource('project', this.currentId!);
          if (images) {
            this.existingImages.set(images as ExistingImage[]);
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

  updateTranslation(field: 'title' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { title: '', description: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    // Validate that at least one language has a title
    const hasTitle = Array.from(this.translations.values()).some((t) => t.title.trim());
    if (!hasTitle) {
      this.error.set('El título es requerido en al menos un idioma');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        url: this.formData.url || null,
        created_at: this.formData.created_at || null,
        parent_project_id: this.formData.parent_project_id,
        source_id: this.formData.source_id,
        source_type: this.formData.source_type,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        title: t.title || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'project',
          'project_translation',
          'project_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'project',
          'project_translation',
          'project_id',
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
        // Save pending skill usages
        if (this.skillUsageManager?.hasPendingUsages()) {
          await this.skillUsageManager.savePendingUsages(entityId);
        }
        if (this.contentSectionManager?.hasPendingItems()) {
          await this.contentSectionManager.savePendingItems(entityId);
        }
      }

      this.router.navigate(['/dashboard/projects']);
    } catch (err) {
      this.error.set('Error al guardar el proyecto');
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
          source_type: 'project',
          source_id: entityId,
          position: i,
        });
      } catch (err) {
        console.error('Error saving image:', err);
      }
    }
    this.pendingImages.set([]);
  }

  async onImageUploaded(data: { path: string; url: string }): Promise<void> {
    if (this.currentId) {
      // If editing existing entity, save immediately
      try {
        await this.supabase.create('image', {
          url: data.url,
          source_type: 'project',
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
