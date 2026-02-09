import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Competition, CompetitionTranslation } from '@core/models';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { CompetitionFormBaseInfoComponent } from './competition-form-base-info/competition-form-base-info.component';
import { CompetitionFormTranslationsComponent } from './competition-form-translations/competition-form-translations.component';
import { BaseEntityFormComponent } from '@shared/components/base-entity-form/base-entity-form.component';

interface CompetitionTranslationData {
  name: string;
  description: string;
  result: string;
}

@Component({
  selector: 'app-competition-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, ContentSectionManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, CompetitionFormBaseInfoComponent, CompetitionFormTranslationsComponent],
  templateUrl: './competition-form.component.html',
})
export class CompetitionFormComponent extends BaseEntityFormComponent<Competition, CompetitionTranslationData> {
  override skillUsageManager = viewChild<SkillUsageManagerComponent>('skillUsageManager');
  override contentSectionManager = viewChild<ContentSectionManagerComponent>('contentSectionManager');

  formData = {
    organizer: '',
    date: '',
  };

  getSourceType(): string { return 'competition'; }
  getTableName(): string { return 'competitions'; }
  getTranslationTableName(): string { return 'competitions_translation'; }
  getForeignKey(): string { return 'competitions_id'; }
  getNavigateBackPath(): string { return '/dashboard/competitions'; }
  protected override getSaveErrorMessage(): string { return this.t.instant('errors.competitionSaveFailed'); }

  getEmptyTranslation(): CompetitionTranslationData {
    return { name: '', description: '', result: '' };
  }

  initializeFormData(data: Competition): void {
    this.formData = {
      organizer: data.organizer || '',
      date: data.date?.split('T')[0] || '',
    };
  }

  initializeTranslations(translations: CompetitionTranslationData[]): void {
    for (const t of translations as unknown as CompetitionTranslation[]) {
      const langCode = t.language?.code;
      if (langCode) {
        this.translations.set(langCode, {
          name: t.name || '',
          description: t.description || '',
          result: t.result || '',
        });
      }
    }
  }

  updateTranslation(field: 'name' | 'description' | 'result', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || this.getEmptyTranslation();
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  validateForm(): string | null {
    const hasName = Array.from(this.translations.values()).some((t) => t.name.trim());
    if (!hasName) return this.t.instant('validation.nameRequiredOneLanguage');
    return null;
  }

  buildFormPayload(): Record<string, unknown> {
    return {
      organizer: this.formData.organizer || null,
      date: this.formData.date || null,
    };
  }

  buildTranslationsPayload(): { language: string; [key: string]: string | null }[] {
    return Array.from(this.translations.entries())
      .filter(([_, t]) => t.name.trim()) // Only include translations with a name
      .map(([lang, t]) => ({
        language: lang,
        name: t.name,
        description: t.description || null,
        result: t.result || null,
      }));
  }
}
