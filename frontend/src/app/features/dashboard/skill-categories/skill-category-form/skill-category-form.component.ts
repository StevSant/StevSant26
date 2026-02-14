import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslationDataService } from '@core/services/translation-data.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SkillCategory, SkillCategoryTranslation, Language } from '@core/models';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-skill-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, UpperCasePipe, TranslatePipe, LanguageTabsComponent],
  templateUrl: './skill-category-form.component.html',
})
export class SkillCategoryFormComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private languageService = inject(LanguageService);
  private t = inject(TranslateService);
  private logger = inject(LoggerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Translations map by language code
  translations: Map<string, { name: string; approach: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { name: string; approach: string } {
    return this.translations.get(this.currentEditLanguage()) || { name: '', approach: '' };
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
        this.translations.set(lang.code, { name: '', approach: '' });
      }

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.translationData.getByIdWithTranslations<SkillCategory>(
          'skill_category',
          'skill_category_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          // Load translations
          if (data.translations) {
            for (const t of data.translations as SkillCategoryTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  name: t.name || '',
                  approach: t.approach || '',
                });
              }
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

  setEditLanguage(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  updateTranslation(field: 'name' | 'approach', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { name: '', approach: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  async onSubmit(): Promise<void> {
    // Validate that at least one language has a name
    const hasName = Array.from(this.translations.values()).some((t) => t.name.trim());
    if (!hasName) {
      this.error.set(this.t.instant('validation.nameRequiredOneLanguage'));
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {};

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        name: t.name || null,
        approach: t.approach || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.translationData.createWithTranslations(
          'skill_category',
          'skill_category_translation',
          'skill_category_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.translationData.updateWithTranslations(
          'skill_category',
          'skill_category_translation',
          'skill_category_id',
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/skill-categories']);
    } catch (err) {
      this.error.set(this.t.instant('errors.categorySaveFailed'));
      this.logger.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }
}
