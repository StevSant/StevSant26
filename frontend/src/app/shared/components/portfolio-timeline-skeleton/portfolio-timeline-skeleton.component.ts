import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-timeline-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './portfolio-timeline-skeleton.component.html',
})
export class PortfolioTimelineSkeletonComponent {}
