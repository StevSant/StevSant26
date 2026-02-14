import { Component, input, output, inject, OnInit, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { TranslationDataService } from '@core/services/translation-data.service';
import { Project, Event, Experience, Competition } from '@core/models';
import { LoggerService } from '@core/services/logger.service';

interface SourceOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-project-form-association',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './project-form-association.component.html',
})
export class ProjectFormAssociationComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  sourceType = input<string | null>(null);
  sourceId = input<number | null>(null);
  parentProjectId = input<number | null>(null);
  parentProjects = input.required<Project[]>();
  getProjectTitle = input.required<(project: Project) => string>();

  sourceTypeChange = output<string | null>();
  sourceIdChange = output<number | null>();
  parentProjectIdChange = output<number | null>();

  sourceOptions = signal<SourceOption[]>([]);
  loadingOptions = signal(false);

  constructor() {
    // React to sourceType changes and load options
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
    // Load initial options if source type is already set
    const type = this.sourceType();
    if (type) {
      await this.loadSourceOptions(type);
    }
  }

  onSourceTypeChange(type: string | null): void {
    this.sourceTypeChange.emit(type);
    this.sourceIdChange.emit(null); // Reset source_id when type changes
  }

  private async loadSourceOptions(type: string): Promise<void> {
    this.loadingOptions.set(true);
    try {
      const lang = this.translateService.currentLang();
      let options: SourceOption[] = [];

      if (type === 'event') {
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
