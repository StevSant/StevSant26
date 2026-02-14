import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslationDataService } from '@core/services/translation-data.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Skill, SkillTranslation, SkillCategory, Language } from '@core/models';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-skill-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UpperCasePipe, TranslatePipe, LanguageTabsComponent],
  templateUrl: './skill-form.component.html',
})
export class SkillFormComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  categories = signal<SkillCategory[]>([]);
  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Base fields (non-translatable)
  formData = {
    skill_category_id: null as number | null,
    icon_url: '' as string,
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

  /**
   * Get the translated name for a category
   */
  getCategoryName(category: SkillCategory): string {
    const lang = this.translateService.currentLang();
    const translation = category.translations?.find(t => t.language?.code === lang);
    return translation?.name || category.translations?.[0]?.name || `Category #${category.id}`;
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

      const { data: cats } = await this.translationData.getWithTranslations<SkillCategory>(
        'skill_category',
        'skill_category_translation',
        'skill_category_id'
      );
      this.categories.set(cats || []);

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.translationData.getByIdWithTranslations<Skill>(
          'skill',
          'skill_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            skill_category_id: data.skill_category_id,
            icon_url: data.icon_url || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as SkillTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  name: t.name || '',
                  description: t.description || '',
                });
              }
            }
          }
        }
      }
    } catch (err) {
      this.error.set(this.translateService.instant('errors.dataLoadFailed'));
      this.logger.error('Load error:', err);
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
      this.error.set(this.translateService.instant('validation.nameRequiredOneLanguage'));
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        skill_category_id: this.formData.skill_category_id,
        icon_url: this.formData.icon_url || null,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        name: t.name || null,
        description: t.description || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.translationData.createWithTranslations(
          'skill',
          'skill_translation',
          'skill_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.translationData.updateWithTranslations(
          'skill',
          'skill_translation',
          'skill_id',
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/skills']);
    } catch (err) {
      this.error.set(this.translateService.instant('errors.skillSaveFailed'));
      this.logger.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }
}
