import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { MatIcon } from '@angular/material/icon';
import { ProgressiveImageComponent } from '@shared/components/progressive-image/progressive-image.component';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { Project } from '@core/models';

@Component({
  selector: 'app-portfolio-featured-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    ScrollRevealDirective,
    MatIcon,
    ProgressiveImageComponent,
  ],
  templateUrl: './portfolio-featured-projects.component.html',
})
export class PortfolioFeaturedProjectsComponent {
  protected data = inject(PortfolioDataService);

  pinnedProjects = input<Project[]>([]);
}
