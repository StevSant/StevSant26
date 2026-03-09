import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { MatIcon } from '@angular/material/icon';
import {
  PortfolioDataService,
  SkillCategoryWithSkills,
  SkillWithLevel,
} from '../../services/portfolio-data.service';
import { getSkillFallbackIcon } from '@shared/utils/skill-icons';

@Component({
  selector: 'app-portfolio-skills-ticker',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ScrollRevealDirective, MatIcon],
  templateUrl: './portfolio-skills-ticker.component.html',
})
export class PortfolioSkillsTickerComponent {
  protected data = inject(PortfolioDataService);

  topSkillCategories = input<SkillCategoryWithSkills[]>([]);
  allSkills = input<SkillWithLevel[]>([]);

  /** Get a fallback icon for a skill when icon_url is not set. */
  getSkillFallback(skillName: string): { type: 'url' | 'flag'; value: string } | null {
    return getSkillFallbackIcon(skillName);
  }
}
