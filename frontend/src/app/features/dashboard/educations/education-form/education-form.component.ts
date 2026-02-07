import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Education, EducationTranslation, Language } from '@core/models';
import { ImageUploadComponent, ExistingImage } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent, ExistingDocument } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { EducationFormBaseInfoComponent } from './education-form-base-info/education-form-base-info.component';
import { EducationFormTranslationsComponent } from './education-form-translations/education-form-translations.component';

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, ContentSectionManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, EducationFormBaseInfoComponent, EducationFormTranslationsComponent],
  templateUrl: './education-form.component.html',
})
export class EducationFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('skillUsageManager') skillUsageManager!: SkillUsageManagerComponent;
  @ViewChild('contentSectionManager') contentSectionManager!: ContentSectionManagerComponent;

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  currentEditLanguage = signal<string>('es');
  pendingImages = signal<{ path: string; url: string }[]>([]);
  existingImages = signal<ExistingImage[]>([]);
  pendingDocuments = signal<{ path: string; url: string; file_name: string; file_type: string; file_size: number }[]>([]);
  existingDocuments = signal<ExistingDocument[]>([]);

  formData = {
    institution: '',
    start_date: '',
    end_date: '',
    institution_image_url: '',
  };

  translations: Map<string, { degree: string; field_of_study: string; description: string }> = new Map();

  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  get currentTranslation(): { degree: string; field_of_study: string; description: string } {
    return this.translations.get(this.currentEditLanguage()) || { degree: '', field_of_study: '', description: '' };
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
      for (const lang of this.supportedLanguages) {
        this.translations.set(lang.code, { degree: '', field_of_study: '', description: '' });
      }
      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<Education>(
          'education', 'education_translation', this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            institution: data.institution || '',
            start_date: data.start_date?.split('T')[0] || '',
            end_date: data.end_date?.split('T')[0] || '',
            institution_image_url: data.institution_image_url || '',
          };
          if (data.translations) {
            for (const t of data.translations as EducationTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  degree: t.degree || '',
                  field_of_study: t.field_of_study || '',
                  description: t.description || '',
                });
              }
            }
          }
          const { data: images } = await this.supabase.getImagesBySource('education', this.currentId!);
          if (images) this.existingImages.set(images as ExistingImage[]);
          const { data: documents } = await this.supabase.getDocumentsBySource('education', this.currentId!);
          if (documents) this.existingDocuments.set(documents as ExistingDocument[]);
        }
      }
    } catch (err) {
      this.error.set('Error al cargar los datos');
      console.error('Load error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  setEditLanguage(langCode: string): void { this.currentEditLanguage.set(langCode); }

  updateTranslation(field: 'degree' | 'field_of_study' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { degree: '', field_of_study: '', description: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.institution.trim()) { this.error.set('La institución es requerida'); return; }
    const hasDegree = Array.from(this.translations.values()).some((t) => t.degree.trim());
    if (!hasDegree) { this.error.set('El título/grado es requerido en al menos un idioma'); return; }

    this.saving.set(true);
    this.error.set(null);
    try {
      const basePayload = {
        institution: this.formData.institution,
        start_date: this.formData.start_date || null,
        end_date: this.formData.end_date || null,
        institution_image_url: this.formData.institution_image_url || null,
      };
      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        degree: t.degree || null,
        field_of_study: t.field_of_study || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations('education', 'education_translation', 'education_id', basePayload, translationsPayload);
      } else {
        result = await this.supabase.updateWithTranslations('education', 'education_translation', 'education_id', this.currentId!, basePayload, translationsPayload);
      }
      if (result.error) throw result.error;

      const entityId = this.isNew ? (result.data as { id: number })?.id : this.currentId!;
      if (entityId) {
        await this.savePendingImages(entityId);
        await this.savePendingDocuments(entityId);
        if (this.skillUsageManager?.hasPendingUsages()) {
          await this.skillUsageManager.savePendingUsages(entityId);
        }
        if (this.contentSectionManager?.hasPendingItems()) {
          await this.contentSectionManager.savePendingItems(entityId);
        }
      }
      this.router.navigate(['/dashboard/educations']);
    } catch (err) {
      this.error.set('Error al guardar la formación académica');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  private async savePendingImages(entityId: number): Promise<void> {
    for (const img of this.pendingImages()) {
      try {
        await this.supabase.create('image', {
          url: img.url,
          source_type: 'education',
          source_id: entityId,
          position: 0,
        });
      } catch (err) { console.error('Error saving image:', err); }
    }
  }

  private async savePendingDocuments(entityId: number): Promise<void> {
    for (const doc of this.pendingDocuments()) {
      try {
        await this.supabase.create('document', {
          url: doc.url,
          file_name: doc.file_name,
          file_type: doc.file_type,
          file_size: doc.file_size,
          source_type: 'education',
          source_id: entityId,
          position: 0,
        });
      } catch (err) { console.error('Error saving document:', err); }
    }
  }

  async onDocumentUploaded(data: { path: string; url: string; file_name: string; file_type: string; file_size: number }): Promise<void> {
    if (this.currentId) {
      try {
        await this.supabase.create('document', { url: data.url, file_name: data.file_name, file_type: data.file_type, file_size: data.file_size, source_type: 'education', source_id: this.currentId, position: 0 });
      } catch (err) { console.error('Error saving document:', err); this.error.set('Error al guardar el documento'); }
    } else {
      this.pendingDocuments.update(docs => [...docs, data]);
    }
  }

  async onImageUploaded(data: { path: string; url: string }): Promise<void> {
    if (this.currentId) {
      try {
        await this.supabase.create('image', { url: data.url, source_type: 'education', source_id: this.currentId, position: 0 });
      } catch (err) { console.error('Error saving image:', err); this.error.set('Error al guardar la imagen'); }
    } else {
      this.pendingImages.update(images => [...images, data]);
    }
  }
}
