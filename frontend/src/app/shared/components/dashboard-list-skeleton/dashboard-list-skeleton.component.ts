import { Component, input } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-dashboard-list-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <div class="space-y-3">
      @for (_ of rows(); track $index) {
        <div class="card p-4 flex items-center gap-4">
          <!-- Drag handle placeholder -->
          <app-skeleton width="20px" height="20px" variant="text" />
          <!-- Pin/icon placeholder -->
          <app-skeleton width="24px" height="24px" variant="circle" />
          <!-- Content -->
          <div class="flex-1 min-w-0 flex flex-col gap-2">
            <app-skeleton width="40%" height="1rem" />
            <app-skeleton width="25%" height="0.75rem" />
          </div>
          <!-- Action buttons placeholder -->
          <div class="hidden sm:flex items-center gap-2">
            <app-skeleton width="28px" height="28px" variant="circle" />
            <app-skeleton width="28px" height="28px" variant="circle" />
          </div>
        </div>
      }
    </div>
  `,
})
export class DashboardListSkeletonComponent {
  count = input(5);
  rows = () => Array.from({ length: this.count() });
}
