import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-home-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <!-- Hero skeleton -->
    <div class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row items-center gap-6 sm:gap-10 md:gap-16">
          <app-skeleton variant="circle" width="10rem" height="10rem" />
          <div class="flex-1 flex flex-col items-center md:items-start gap-4 w-full">
            <app-skeleton width="70%" height="2.5rem" />
            <app-skeleton width="40%" height="1rem" />
            <app-skeleton width="30%" height="1.75rem" />
            <div class="flex gap-3 mt-2">
              <app-skeleton width="120px" height="2.5rem" />
              <app-skeleton width="120px" height="2.5rem" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured projects grid skeleton -->
    <div class="px-4 sm:px-6 lg:px-8 pb-16">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-center mb-10">
          <app-skeleton width="200px" height="0.75rem" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (_ of [1, 2, 3]; track $index) {
            <div
              class="bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) overflow-hidden"
            >
              <app-skeleton variant="image" width="100%" height="10rem" />
              <div class="p-6 flex flex-col gap-3">
                <app-skeleton width="80%" height="1.25rem" />
                <app-skeleton width="100%" height="0.75rem" />
                <app-skeleton width="60%" height="0.75rem" />
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PortfolioHomeSkeletonComponent {}
