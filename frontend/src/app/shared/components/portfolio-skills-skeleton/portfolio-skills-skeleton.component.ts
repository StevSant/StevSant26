import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-skills-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './portfolio-skills-skeleton.component.html',
})
export class PortfolioSkillsSkeletonComponent {}
