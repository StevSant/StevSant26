import { Component, input, output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { LanguageTabsComponent } from '../../language-tabs/language-tabs.component';
import { ContentSectionItem } from '../content-section-item.model';
import { SECTION_KEY_OPTIONS, SectionKeyOption } from '../section-key-options';
import { ContentSectionKey } from '@core/models/entities/content-section.model';

@Component({
  selector: 'app-content-section-add-form',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LanguageTabsComponent],
  templateUrl: './content-section-add-form.component.html',
})
export class ContentSectionAddFormComponent {
  private translate = inject(TranslateService);

  formData = input.required<ContentSectionItem>();
  saving = input<boolean>(false);
  currentEditLanguage = input<string>('es');

  add = output<void>();
  cancel = output<void>();
  sectionKeyChange = output<ContentSectionKey>();
  iconChange = output<string>();
  languageChange = output<string>();
  translationChange = output<{ field: 'title' | 'body'; value: string }>();

  readonly sectionKeyOptions: SectionKeyOption[] = SECTION_KEY_OPTIONS;

  get currentTranslation(): { title: string; body: string } {
    return this.formData().translations.get(this.currentEditLanguage()) || { title: '', body: '' };
  }

  getSectionKeyLabel(key: ContentSectionKey): string {
    const option = this.sectionKeyOptions.find(o => o.value === key);
    return option ? this.translate.instant(option.labelKey) : key;
  }

  onSectionKeyChange(value: string): void {
    this.sectionKeyChange.emit(value as ContentSectionKey);
  }

  onIconChange(value: string): void {
    this.iconChange.emit(value);
  }

  onLanguageChange(langCode: string): void {
    this.languageChange.emit(langCode);
  }

  onFieldChange(field: 'title' | 'body', value: string): void {
    this.translationChange.emit({ field, value });
  }
}
