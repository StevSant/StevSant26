import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-grid-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './portfolio-grid-skeleton.component.html',
})
export class PortfolioGridSkeletonComponent {}
