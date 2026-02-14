import { Component, input, output, inject, signal, effect, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Skill, SourceType, Event, Experience, Competition, Project } from '@core/models';
import { TranslationDataService } from '@core/services/translation-data.service';
import { TranslateService } from '@core/services/translate.service';
import { LoggerService } from '@core/services/logger.service';

interface SourceOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-skill-usage-form-base-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './skill-usage-form-base-info.component.html',
})
export class SkillUsageFormBaseInfoComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  skills = input.required<Skill[]>();
  skillId = input<number>(0);
  sourceType = input<SourceType>('project');
  sourceId = input<number>(0);
  level = input<number | null>(null);
  startedAt = input<string>('');
  endedAt = input<string>('');
  getSkillName = input.required<(skill: Skill) => string>();

  skillIdChange = output<number>();
  sourceTypeChange = output<SourceType>();
  sourceIdChange = output<number>();
  levelChange = output<number | null>();
  startedAtChange = output<string>();
  endedAtChange = output<string>();

  sourceOptions = signal<SourceOption[]>([]);
  loadingOptions = signal(false);

  constructor() {
    effect(() => {
      const type = this.sourceType();
      if (type) {
        this.loadSourceOptions(type);
      } else {
        this.sourceOptions.set([]);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    const type = this.sourceType();
    if (type) {
      await this.loadSourceOptions(type);
    }
  }

  onSourceTypeChange(type: SourceType): void {
    this.sourceTypeChange.emit(type);
    this.sourceIdChange.emit(0);
  }

  setLevel(value: number | null): void {
    this.levelChange.emit(value);
  }

  private async loadSourceOptions(type: string): Promise<void> {
    this.loadingOptions.set(true);
    try {
      const lang = this.translateService.currentLang();
      let options: SourceOption[] = [];

      if (type === 'project') {
        const { data } = await this.translationData.getWithTranslations<Project>('project', 'project_translation', 'project_id');
        options = (data || []).map(p => ({
          id: p.id,
          label: this.getTranslatedName(p.translations, lang, 'title') || `Project #${p.id}`,
        }));
      } else if (type === 'event') {
        const { data } = await this.translationData.getWithTranslations<Event>('event', 'event_translation', 'event_id');
        options = (data || []).map(e => ({
          id: e.id,
          label: this.getTranslatedName(e.translations, lang, 'name') || `Event #${e.id}`,
        }));
      } else if (type === 'experience') {
        const { data } = await this.translationData.getWithTranslations<Experience>('experience', 'experience_translation', 'experience_id');
        options = (data || []).map(e => ({
          id: e.id,
          label: (this.getTranslatedName(e.translations, lang, 'role') || `Experience #${e.id}`) + (e.company ? ` - ${e.company}` : ''),
        }));
      } else if (type === 'competition') {
        const { data } = await this.translationData.getWithTranslations<Competition>('competitions', 'competitions_translation', 'competitions_id');
        options = (data || []).map(c => ({
          id: c.id,
          label: this.getTranslatedName(c.translations, lang, 'name') || `Competition #${c.id}`,
        }));
      }

      this.sourceOptions.set(options);
    } catch (err) {
      this.logger.error('Error loading source options:', err);
      this.sourceOptions.set([]);
    } finally {
      this.loadingOptions.set(false);
    }
  }

  private getTranslatedName(translations: any[] | undefined, lang: string, field: string): string | null {
    if (!translations || translations.length === 0) return null;
    const t = translations.find((tr: any) => tr.language?.code === lang);
    return t?.[field] || translations[0]?.[field] || null;
  }
}
