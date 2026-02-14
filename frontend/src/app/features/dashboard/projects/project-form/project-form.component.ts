import { Component, signal, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Project, ProjectTranslation, getTranslation } from '@core/models';
import { ImageUploadComponent } from '@shared/components/image-upload/image-upload.component';
import { SkillUsageManagerComponent } from '@shared/components/skill-usage-manager/skill-usage-manager.component';
import { ContentSectionManagerComponent } from '@shared/components/content-section-manager/content-section-manager.component';
import { FormHeaderComponent } from '@shared/components/form-header/form-header.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { FormActionsComponent } from '@shared/components/form-actions/form-actions.component';
import { ProjectFormBaseInfoComponent } from './project-form-base-info/project-form-base-info.component';
import { ProjectFormTranslationsComponent } from './project-form-translations/project-form-translations.component';
import { ProjectFormAssociationComponent } from './project-form-association/project-form-association.component';
import { BaseEntityFormComponent } from '@shared/components/base-entity-form/base-entity-form.component';

interface ProjectTranslationData {
  title: string;
  description: string;
}

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
export class ProjectFormComponent extends BaseEntityFormComponent<Project, ProjectTranslationData> {
  private translateService = inject(TranslateService);

  override skillUsageManager = viewChild<SkillUsageManagerComponent>('skillUsageManager');
  override contentSectionManager = viewChild<ContentSectionManagerComponent>('contentSectionManager');

  parentProjects = signal<Project[]>([]);

  // Base fields (non-translatable)
  formData = {
    url: '',
    demo_url: '',
    created_at: new Date().toISOString().split('T')[0],
    parent_project_id: null as number | null,
    source_id: null as number | null,
    source_type: null as string | null,
  };

  // Helper to get project title from translations
  getProjectTitle(project: Project): string {
    const translation = getTranslation(project.translations, this.translateService.currentLang());
    return translation?.title || `Project #${project.id}`;
  }

  // ==================== BASE CLASS IMPLEMENTATIONS ====================

  getSourceType(): string { return 'project'; }
  getTableName(): string { return 'project'; }
  getTranslationTableName(): string { return 'project_translation'; }
  getForeignKey(): string { return 'project_id'; }
  getNavigateBackPath(): string { return '/dashboard/projects'; }

  protected override supportsDocuments(): boolean { return false; }

  protected override getSaveErrorMessage(): string { return this.t.instant('errors.projectSaveFailed'); }

  getEmptyTranslation(): ProjectTranslationData {
    return { title: '', description: '' };
  }

  protected override async onBeforeLoadEntity(): Promise<void> {
    const { data: projects } = await this.translationData.getWithTranslations<Project>(
      'project',
      'project_translation',
      'project_id'
    );
    if (projects) {
      this.parentProjects.set(
        this.currentId ? projects.filter((p) => p.id !== this.currentId) : projects
      );
    }
  }

  initializeFormData(data: Project): void {
    this.formData = {
      url: data.url || '',
      demo_url: data.demo_url || '',
      created_at: data.created_at?.split('T')[0] || '',
      parent_project_id: data.parent_project_id,
      source_id: data.source_id,
      source_type: data.source_type,
    };
  }

  initializeTranslations(translations: ProjectTranslationData[]): void {
    for (const t of translations as unknown as ProjectTranslation[]) {
      const langCode = t.language?.code;
      if (langCode) {
        this.translations.set(langCode, {
          title: t.title || '',
          description: t.description || '',
        });
      }
    }
  }

  updateTranslation(field: 'title' | 'description', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || this.getEmptyTranslation();
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  validateForm(): string | null {
    const hasTitle = Array.from(this.translations.values()).some((t) => t.title.trim());
    if (!hasTitle) return this.t.instant('validation.titleRequiredOneLanguage');
    return null;
  }

  buildFormPayload(): Record<string, unknown> {
    return {
      url: this.formData.url || null,
      demo_url: this.formData.demo_url || null,
      created_at: this.formData.created_at || null,
      parent_project_id: this.formData.parent_project_id,
      source_id: this.formData.source_id,
      source_type: this.formData.source_type,
    };
  }

  buildTranslationsPayload(): { language: string;[key: string]: string | null }[] {
    return Array.from(this.translations.entries()).map(([lang, t]) => ({
      language: lang,
      title: t.title || null,
      description: t.description || null,
    }));
  }
}
