import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SupabaseService } from '@core/services/supabase.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { SkillUsage, SkillUsageTranslation, Skill, SourceType, Language } from '@core/models';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';

@Component({
  selector: 'app-skill-usage-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LanguageTabsComponent],
  templateUrl: './skill-usage-form.component.html',
})
export class SkillUsageFormComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  skills = signal<Skill[]>([]);
  isNew = true;
  currentId: number | null = null;

  // Current language for editing translations
  currentEditLanguage = signal<string>('es');

  // Base fields (non-translatable)
  formData = {
    skill_id: 0,
    source_id: 0,
    source_type: 'project' as SourceType,
    level: null as number | null,
    started_at: '',
    ended_at: '',
  };

  // Translations map by language code
  translations: Map<string, { notes: string }> = new Map();

  // Get available languages from service
  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  // Get current translation being edited
  get currentTranslation(): { notes: string } {
    return this.translations.get(this.currentEditLanguage()) || { notes: '' };
  }

  /**
   * Get the translated name for a skill
   */
  getSkillName(skill: Skill): string {
    const lang = this.translateService.currentLang();
    const translation = skill.translations?.find(t => t.language?.code === lang);
    return translation?.name || skill.translations?.[0]?.name || `Skill #${skill.id}`;
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
        this.translations.set(lang.code, { notes: '' });
      }

      const { data: skillsData } = await this.supabase.getWithTranslations<Skill>(
        'skill',
        'skill_translation',
        'skill_id'
      );
      this.skills.set(skillsData || []);

      if (!this.isNew && this.currentId) {
        const { data, error } = await this.supabase.getByIdWithTranslations<SkillUsage>(
          'skill_usages',
          'skill_usages_translation',
          this.currentId
        );
        if (error) throw error;
        if (data) {
          this.formData = {
            skill_id: data.skill_id,
            source_id: data.source_id || 0,
            source_type: data.source_type || 'project',
            level: data.level,
            started_at: data.started_at?.split('T')[0] || '',
            ended_at: data.ended_at?.split('T')[0] || '',
          };

          // Load translations
          if (data.translations) {
            for (const t of data.translations as SkillUsageTranslation[]) {
              const langCode = t.language?.code;
              if (langCode) {
                this.translations.set(langCode, {
                  notes: t.notes || '',
                });
              }
            }
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

  updateTranslation(field: 'notes', value: string): void {
    const current = this.translations.get(this.currentEditLanguage()) || { notes: '' };
    current[field] = value;
    this.translations.set(this.currentEditLanguage(), current);
  }

  setLevel(level: number | null): void {
    this.formData.level = level;
  }

  async onSubmit(): Promise<void> {
    if (!this.formData.skill_id || !this.formData.source_id) {
      this.error.set('La habilidad y el ID de fuente son requeridos');
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        skill_id: this.formData.skill_id,
        source_id: this.formData.source_id,
        source_type: this.formData.source_type,
        level: this.formData.level,
        started_at: this.formData.started_at || null,
        ended_at: this.formData.ended_at || null,
      };

      const translationsPayload = Array.from(this.translations.entries()).map(([lang, t]) => ({
        language: lang,
        notes: t.notes || null,
      }));

      let result;
      if (this.isNew) {
        result = await this.supabase.createWithTranslations(
          'skill_usages',
          'skill_usages_translation',
          'skill_usage_id',
          basePayload,
          translationsPayload
        );
      } else {
        result = await this.supabase.updateWithTranslations(
          'skill_usages',
          'skill_usages_translation',
          'skill_usage_id',
          this.currentId!,
          basePayload,
          translationsPayload
        );
      }

      if (result.error) throw result.error;
      this.router.navigate(['/dashboard/skill-usages']);
    } catch (err) {
      this.error.set('Error al guardar el vínculo');
      console.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }
}
