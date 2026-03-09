import { Component, input } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-dashboard-list-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './dashboard-list-skeleton.component.html',
})
export class DashboardListSkeletonComponent {
  count = input(5);
  rows = () => Array.from({ length: this.count() });
}
