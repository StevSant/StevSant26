import { Component, input, output, inject } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { ContentSectionItem } from '../content-section-item.model';
import { SECTION_KEY_OPTIONS } from '../section-key-options';

@Component({
  selector: 'app-content-section-item',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './content-section-item.component.html',
})
export class ContentSectionItemComponent {
  private translate = inject(TranslateService);

  section = input.required<ContentSectionItem>();
  displayTitle = input<string>('');

  edit = output<ContentSectionItem>();
  remove = output<ContentSectionItem>();

  get sectionIcon(): string {
    const item = this.section();
    if (item.icon) return item.icon;
    const option = SECTION_KEY_OPTIONS.find(o => o.value === item.section_key);
    return option?.icon || '📝';
  }

  get sectionKeyLabel(): string {
    const option = SECTION_KEY_OPTIONS.find(o => o.value === this.section().section_key);
    return option ? this.translate.instant(option.labelKey) : this.section().section_key;
  }
}
