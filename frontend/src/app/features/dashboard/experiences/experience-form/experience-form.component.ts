import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Experience, ExperienceTranslation } from '@core/models';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { ExperienceFormBaseInfoComponent } from './experience-form-base-info/experience-form-base-info.component';
import { ExperienceFormTranslationsComponent } from './experience-form-translations/experience-form-translations.component';
import { BaseEntityFormComponent } from '@shared/components/base-entity-form/base-entity-form.component';

interface ExperienceTranslationData {
  role: string;
  description: string;
}

@Component({
  selector: 'app-experience-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, ContentSectionManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, ExperienceFormBaseInfoComponent, ExperienceFormTranslationsComponent],
  templateUrl: './experience-form.component.html',
})
export class ExperienceFormComponent extends BaseEntityFormComponent<Experience, ExperienceTranslationData> {
  override skillUsageManager = viewChild<SkillUsageManagerComponent>('skillUsageManager');
  override contentSectionManager = viewChild<ContentSectionManagerComponent>('contentSectionManager');

  // Base fields (non-translatable)
  formData = {
    company: '',
    start_date: '',
    end_date: '',
    company_image_url: '',
  };

  // ==================== BASE CLASS IMPLEMENTATIONS ====================

  getSourceType(): string { return 'experience'; }
  getTableName(): string { return 'experience'; }
  getTranslationTableName(): string { return 'experience_translation'; }
  getForeignKey(): string { return 'experience_id'; }
  getNavigateBackPath(): string { return '/dashboard/experiences'; }

  protected override getSaveErrorMessage(): string { return this.t.instant('errors.experienceSaveFailed'); }

  getEmptyTranslation(): ExperienceTranslationData {
    return { role: '', description: '' };
  }

  initializeFormData(data: Experience): void {
    this.formData = {
      company: data.company || '',
      start_date: data.start_date?.split('T')[0] || '',
      end_date: data.end_date?.split('T')[0] || '',
      company_image_url: data.company_image_url || '',
    };
  }

  initializeTranslations(translations: ExperienceTranslationData[]): void {
    for (const t of translations as unknown as ExperienceTranslation[]) {
      const langCode = t.language?.code;
      if (langCode) {
        this.translations.set(langCode, {
          role: t.role || '',
          description: t.description || '',
        });
      }
    }
  }

  updateTranslation(field: 'role' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || this.getEmptyTranslation();
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  validateForm(): string | null {
    if (!this.formData.company.trim()) return this.t.instant('validation.companyRequired');
    const hasRole = Array.from(this.translations.values()).some((t) => t.role.trim());
    if (!hasRole) return this.t.instant('validation.roleRequiredOneLanguage');
    return null;
  }

  buildFormPayload(): Record<string, unknown> {
    return {
      company: this.formData.company,
      start_date: this.formData.start_date || null,
      end_date: this.formData.end_date || null,
      company_image_url: this.formData.company_image_url || null,
    };
  }

  buildTranslationsPayload(): { language: string;[key: string]: string | null }[] {
    return Array.from(this.translations.entries()).map(([lang, t]) => ({
      language: lang,
      role: t.role || null,
      description: t.description || null,
    }));
  }
}
