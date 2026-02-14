import { Component, input, signal, inject, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationDataService } from '@core/services/translation-data.service';
import { CrudService } from '@core/services/crud.service';
import { LanguageService } from '@core/services/language.service';
import { TranslateService } from '@core/services/translate.service';
import { SkillUsage, Skill, SourceType, Language } from '@core/models';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { SkillUsageAddFormComponent } from './skill-usage-add-form/skill-usage-add-form.component';
import { SkillUsageItemComponent } from './skill-usage-item/skill-usage-item.component';
import { LoggerService } from '@core/services/logger.service';

export interface SkillUsageItem {
  id?: number;
  skill_id: number;
  skill?: Skill;
  level: number | null;
  started_at: string | null;
  ended_at: string | null;
  translations: Map<string, { notes: string }>;
  isNew?: boolean;
  isEditing?: boolean;
}

@Component({
  selector: 'app-skill-usage-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, SkillUsageAddFormComponent, SkillUsageItemComponent],
  templateUrl: './skill-usage-manager.component.html',
})
export class SkillUsageManagerComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private crud = inject(CrudService);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  // Signal inputs
  sourceType = input.required<SourceType>();
  sourceId = input<number | null>(null);

  // Internal signals
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  skills = signal<Skill[]>([]);
  skillUsages = signal<SkillUsageItem[]>([]);
  showAddForm = signal(false);
  currentEditLanguage = signal<string>('es');

  // New skill usage form data
  newUsageForm: SkillUsageItem = this.createEmptyUsage();

  // Pending usages to save after entity creation
  pendingUsages = signal<SkillUsageItem[]>([]);

  get supportedLanguages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  get currentNewTranslation(): { notes: string } {
    return this.newUsageForm.translations.get(this.currentEditLanguage()) || { notes: '' };
  }

  constructor() {
    // Effect to load skill usages when sourceId changes
    effect(() => {
      const id = this.sourceId();
      if (id) {
        this.loadSkillUsages(id);
      } else {
        // New entity - show pending usages if any
        this.skillUsages.set([...this.pendingUsages()]);
        this.loading.set(false);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadSkills();
  }

  private async loadSkills(): Promise<void> {
    try {
      const { data } = await this.translationData.getWithTranslations<Skill>(
        'skill',
        'skill_translation',
        'skill_id'
      );
      this.skills.set(data || []);
    } catch (err) {
      this.logger.error('Error loading skills:', err);
    }
  }

  private async loadSkillUsages(sourceId: number): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.crud
        .from('skill_usages')
        .select(`
          *,
          skill:skill(*, translations:skill_translation(*, language:language(*))),
          translations:skill_usages_translation(*, language:language(*))
        `)
        .eq('source_type', this.sourceType())
        .eq('source_id', sourceId)
        .eq('is_archived', false)
        .order('position', { ascending: true });

      if (error) throw error;

      const usages: SkillUsageItem[] = (data || []).map((item: SkillUsage) => {
        const translationsMap = new Map<string, { notes: string }>();
        for (const lang of this.supportedLanguages) {
          const existingTrans = item.translations?.find(t => t.language?.code === lang.code);
          translationsMap.set(lang.code, { notes: existingTrans?.notes || '' });
        }
        return {
          id: item.id,
          skill_id: item.skill_id,
          skill: item.skill,
          level: item.level,
          started_at: item.started_at?.split('T')[0] || null,
          ended_at: item.ended_at?.split('T')[0] || null,
          translations: translationsMap,
          isNew: false,
          isEditing: false,
        };
      });

      this.skillUsages.set(usages);
    } catch (err) {
      this.error.set(this.translateService.instant('skillUsages.errors.loadError'));
      this.logger.error('Load error:', err);
    } finally {
      this.loading.set(false);
    }
  }

  private createEmptyUsage(): SkillUsageItem {
    const translations = new Map<string, { notes: string }>();
    for (const lang of this.languageService.supportedLanguages()) {
      translations.set(lang.code, { notes: '' });
    }
    return {
      skill_id: 0,
      level: null,
      started_at: null,
      ended_at: null,
      translations,
      isNew: true,
      isEditing: true,
    };
  }

  getSkillName(skill: Skill | undefined): string {
    if (!skill) return this.translateService.instant('skillUsages.unknownSkill');
    const lang = this.translateService.currentLang();
    const translation = skill.translations?.find(t => t.language?.code === lang);
    return translation?.name || skill.translations?.[0]?.name || `Skill #${skill.id}`;
  }

  /** Bound function reference for passing to child components */
  getSkillNameFn = (skill: Skill): string => {
    return this.getSkillName(skill);
  };

  getSkillById(skillId: number): Skill | undefined {
    return this.skills().find(s => s.id === skillId);
  }

  setEditLanguage(langCode: string): void {
    this.currentEditLanguage.set(langCode);
  }

  updateNewTranslation(value: string): void {
    const current = this.newUsageForm.translations.get(this.currentEditLanguage()) || { notes: '' };
    current.notes = value;
    this.newUsageForm.translations.set(this.currentEditLanguage(), current);
  }

  setLevel(level: number | null): void {
    this.newUsageForm.level = level;
  }

  openAddForm(): void {
    this.newUsageForm = this.createEmptyUsage();
    this.showAddForm.set(true);
    this.error.set(null);
  }

  cancelAdd(): void {
    this.showAddForm.set(false);
    this.newUsageForm = this.createEmptyUsage();
  }

  async addSkillUsage(): Promise<void> {
    if (!this.newUsageForm.skill_id) {
      this.error.set(this.translateService.instant('skillUsages.errors.selectSkill'));
      return;
    }

    const sourceId = this.sourceId();

    if (sourceId) {
      // Entity already exists - save directly
      await this.saveSkillUsage(this.newUsageForm, sourceId);
    } else {
      // Entity not created yet - add to pending list
      const newUsage = {
        ...this.newUsageForm,
        skill: this.getSkillById(this.newUsageForm.skill_id),
        isNew: true,
      };
      this.pendingUsages.update(usages => [...usages, newUsage]);
      this.skillUsages.update(usages => [...usages, newUsage]);
    }

    this.showAddForm.set(false);
    this.newUsageForm = this.createEmptyUsage();
  }

  private async saveSkillUsage(usage: SkillUsageItem, sourceId: number): Promise<void> {
    this.saving.set(true);
    this.error.set(null);

    try {
      const basePayload = {
        skill_id: usage.skill_id,
        source_id: sourceId,
        source_type: this.sourceType(),
        level: usage.level,
        started_at: usage.started_at || null,
        ended_at: usage.ended_at || null,
      };

      const translationsPayload = Array.from(usage.translations.entries()).map(([lang, t]) => ({
        language: lang,
        notes: t.notes || null,
      }));

      const result = await this.translationData.createWithTranslations(
        'skill_usages',
        'skill_usages_translation',
        'skill_usages_id',
        basePayload,
        translationsPayload
      );

      if (result.error) throw result.error;

      // Reload the list
      await this.loadSkillUsages(sourceId);
    } catch (err) {
      this.error.set(this.translateService.instant('skillUsages.errors.saveError'));
      this.logger.error('Save error:', err);
    } finally {
      this.saving.set(false);
    }
  }

  async editSkillUsage(updatedUsage: SkillUsageItem): Promise<void> {
    const sourceId = this.sourceId();

    if (updatedUsage.id && sourceId) {
      // Existing usage - update in DB
      this.saving.set(true);
      this.error.set(null);
      try {
        const basePayload = {
          skill_id: updatedUsage.skill_id,
          source_id: sourceId,
          source_type: this.sourceType(),
          level: updatedUsage.level,
          started_at: updatedUsage.started_at || null,
          ended_at: updatedUsage.ended_at || null,
        };

        const translationsPayload = Array.from(updatedUsage.translations.entries()).map(([lang, t]) => ({
          language: lang,
          notes: t.notes || null,
        }));

        const result = await this.translationData.updateWithTranslations(
          'skill_usages',
          'skill_usages_translation',
          'skill_usages_id',
          updatedUsage.id,
          basePayload,
          translationsPayload
        );

        if (result.error) throw result.error;
        await this.loadSkillUsages(sourceId);
      } catch (err) {
        this.error.set(this.translateService.instant('skillUsages.errors.saveError'));
        this.logger.error('Edit error:', err);
      } finally {
        this.saving.set(false);
      }
    } else {
      // Pending usage - update in local list
      this.skillUsages.update(usages =>
        usages.map(u => (u === this.findOriginalUsage(updatedUsage) ? updatedUsage : u))
      );
      this.pendingUsages.update(usages =>
        usages.map(u => (u.skill_id === updatedUsage.skill_id ? updatedUsage : u))
      );
    }
  }

  private findOriginalUsage(updated: SkillUsageItem): SkillUsageItem | undefined {
    return this.skillUsages().find(u =>
      u.id ? u.id === updated.id : u.skill_id === updated.skill_id
    );
  }

  async removeSkillUsage(usage: SkillUsageItem): Promise<void> {
    if (usage.id) {
      // Existing usage - archive it
      try {
        await this.crud.archive('skill_usages', usage.id);
        this.skillUsages.update(usages => usages.filter(u => u.id !== usage.id));
      } catch (err) {
        this.error.set(this.translateService.instant('skillUsages.errors.deleteError'));
        this.logger.error('Delete error:', err);
      }
    } else {
      // Pending usage - remove from list
      this.pendingUsages.update(usages => usages.filter(u => u !== usage));
      this.skillUsages.update(usages => usages.filter(u => u !== usage));
    }
  }

  /** Called by parent component after entity creation to save pending usages */
  async savePendingUsages(sourceId: number): Promise<void> {
    const pending = this.pendingUsages();
    for (const usage of pending) {
      await this.saveSkillUsage(usage, sourceId);
    }
    this.pendingUsages.set([]);
  }

  /** Check if there are pending usages to save */
  hasPendingUsages(): boolean {
    return this.pendingUsages().length > 0;
  }

  getLevelStars(level: number | null): string {
    if (level === null) return '-';
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  }
}
