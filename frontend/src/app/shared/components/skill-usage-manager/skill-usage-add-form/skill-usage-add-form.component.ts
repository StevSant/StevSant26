import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@core/services/translate.service';
import { Skill } from '@core/models';
import { LanguageTabsComponent } from '../../language-tabs/language-tabs.component';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SkillUsageItem } from '../skill-usage-manager.component';

@Component({
  selector: 'app-skill-usage-add-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LanguageTabsComponent, TranslatePipe],
  templateUrl: './skill-usage-add-form.component.html',
})
export class SkillUsageAddFormComponent {
  private translateService = inject(TranslateService);

  formData = input.required<SkillUsageItem>();
  skills = input.required<Skill[]>();
  saving = input<boolean>(false);
  currentEditLanguage = input<string>('es');
  currentTranslation = input.required<{ notes: string }>();

  add = output();
  cancel = output();
  levelChange = output<number | null>();
  languageChange = output<string>();
  translationChange = output<string>();

  getSkillName(skill: Skill): string {
    const lang = this.translateService.currentLang();
    const translation = skill.translations?.find(t => t.language?.code === lang);
    return translation?.name || skill.translations?.[0]?.name || `Skill #${skill.id}`;
  }
}
