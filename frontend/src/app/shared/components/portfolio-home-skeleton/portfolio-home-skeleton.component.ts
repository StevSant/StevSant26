import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-home-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './portfolio-home-skeleton.component.html',
})
export class PortfolioHomeSkeletonComponent {}
