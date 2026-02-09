import { Component, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Event, EventTranslation } from '@core/models';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { DocumentUploadComponent } from '@shared/components/document-upload/document-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { EventFormBaseInfoComponent } from './event-form-base-info/event-form-base-info.component';
import { EventFormTranslationsComponent } from './event-form-translations/event-form-translations.component';
import { BaseEntityFormComponent } from '@shared/components/base-entity-form/base-entity-form.component';

interface EventTranslationData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, ImageUploadComponent, DocumentUploadComponent, SkillUsageManagerComponent, ContentSectionManagerComponent, FormHeaderComponent, LoadingSpinnerComponent, FormActionsComponent, EventFormBaseInfoComponent, EventFormTranslationsComponent],
  templateUrl: './event-form.component.html',
})
export class EventFormComponent extends BaseEntityFormComponent<Event, EventTranslationData> {
  override skillUsageManager = viewChild<SkillUsageManagerComponent>('skillUsageManager');
  override contentSectionManager = viewChild<ContentSectionManagerComponent>('contentSectionManager');

  formData = {
    assisted_at: '',
  };

  getSourceType(): string { return 'event'; }
  getTableName(): string { return 'event'; }
  getTranslationTableName(): string { return 'event_translation'; }
  getForeignKey(): string { return 'event_id'; }
  getNavigateBackPath(): string { return '/dashboard/events'; }
  protected override getSaveErrorMessage(): string { return this.t.instant('errors.eventSaveFailed'); }

  getEmptyTranslation(): EventTranslationData {
    return { name: '', description: '' };
  }

  initializeFormData(data: Event): void {
    this.formData = {
      assisted_at: data.assisted_at?.split('T')[0] || '',
    };
  }

  initializeTranslations(translations: EventTranslationData[]): void {
    for (const t of translations as unknown as EventTranslation[]) {
      const langCode = t.language?.code;
      if (langCode) {
        this.translations.set(langCode, {
          name: t.name || '',
          description: t.description || '',
        });
      }
    }
  }

  updateTranslation(field: 'name' | 'description', value: string): void {
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
    return { assisted_at: this.formData.assisted_at || null };
  }

  buildTranslationsPayload(): { language: string;[key: string]: string | null }[] {
    return Array.from(this.translations.entries()).map(([lang, t]) => ({
      language: lang,
      name: t.name || null,
      description: t.description || null,
    }));
  }
}
