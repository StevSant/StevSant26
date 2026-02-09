import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Education, EducationTranslation, EducationType } from '@core/models';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { EducationFormBaseInfoComponent } from './education-form-base-info/education-form-base-info.component';
import { EducationFormTranslationsComponent } from './education-form-translations/education-form-translations.component';
import { BaseEntityFormComponent } from '@shared/components/base-entity-form/base-entity-form.component';

interface EducationTranslationData {
  degree: string;
  field_of_study: string;
  description: string;
}

@Component({
  selector: 'app-education-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, ContentSectionManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, EducationFormBaseInfoComponent, EducationFormTranslationsComponent],
  templateUrl: './education-form.component.html',
})
export class EducationFormComponent extends BaseEntityFormComponent<Education, EducationTranslationData> {
  override skillUsageManager = viewChild<SkillUsageManagerComponent>('skillUsageManager');
  override contentSectionManager = viewChild<ContentSectionManagerComponent>('contentSectionManager');

  educationTypes: EducationType[] = ['formal', 'course', 'certification'];

  formData = {
    education_type: 'formal' as EducationType,
    institution: '',
    start_date: '',
    end_date: '',
    institution_image_url: '',
    credential_url: '',
    credential_id: '',
  };

  getSourceType(): string { return 'education'; }
  getTableName(): string { return 'education'; }
  getTranslationTableName(): string { return 'education_translation'; }
  getForeignKey(): string { return 'education_id'; }
  getNavigateBackPath(): string { return '/dashboard/educations'; }
  protected override getSaveErrorMessage(): string { return this.t.instant('errors.educationSaveFailed'); }

  getEmptyTranslation(): EducationTranslationData {
    return { degree: '', field_of_study: '', description: '' };
  }

  initializeFormData(data: Education): void {
    this.formData = {
      education_type: data.education_type || 'formal',
      institution: data.institution || '',
      start_date: data.start_date?.split('T')[0] || '',
      end_date: data.end_date?.split('T')[0] || '',
      institution_image_url: data.institution_image_url || '',
      credential_url: data.credential_url || '',
      credential_id: data.credential_id || '',
    };
  }

  initializeTranslations(translations: EducationTranslationData[]): void {
    for (const t of translations as unknown as EducationTranslation[]) {
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

  updateTranslation(field: 'degree' | 'field_of_study' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || this.getEmptyTranslation();
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  validateForm(): string | null {
    if (!this.formData.institution.trim()) return this.t.instant('validation.institutionRequired');
    const hasDegree = Array.from(this.translations.values()).some((t) => t.degree.trim());
    if (!hasDegree) return this.t.instant('validation.degreeRequiredOneLanguage');
    return null;
  }

  buildFormPayload(): Record<string, unknown> {
    return {
      education_type: this.formData.education_type,
      institution: this.formData.institution,
      start_date: this.formData.start_date || null,
      end_date: this.formData.end_date || null,
      institution_image_url: this.formData.institution_image_url || null,
      credential_url: this.formData.credential_url || null,
      credential_id: this.formData.credential_id || null,
    };
  }

  buildTranslationsPayload(): { language: string; [key: string]: string | null }[] {
    return Array.from(this.translations.entries()).map(([lang, t]) => ({
      language: lang,
      degree: t.degree || null,
      field_of_study: t.field_of_study || null,
      description: t.description || null,
    }));
  }
}
