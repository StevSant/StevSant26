import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-grid-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <section class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Section title -->
        <div class="flex flex-col items-center gap-3 mb-8 sm:mb-10 lg:mb-14">
          <app-skeleton width="120px" height="0.75rem" />
          <div class="w-12 h-px bg-(--color-accent) opacity-60"></div>
        </div>

        <!-- Filter bar placeholder -->
        <div class="mb-8 space-y-4">
          <div class="max-w-md mx-auto">
            <app-skeleton width="100%" height="2.5rem" />
          </div>
          <div class="flex justify-center gap-2">
            <app-skeleton width="80px" height="1.75rem" />
            <app-skeleton width="100px" height="1.75rem" />
            <app-skeleton width="90px" height="1.75rem" />
          </div>
        </div>

        <!-- Card grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          @for (_ of [1, 2, 3, 4, 5, 6]; track $index) {
            <div
              class="bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) overflow-hidden"
            >
              <app-skeleton variant="image" width="100%" height="12rem" />
              <div class="p-5 flex flex-col gap-3">
                <app-skeleton width="75%" height="1.25rem" />
                <app-skeleton width="100%" height="0.75rem" />
                <app-skeleton width="50%" height="0.75rem" />
                <div class="flex gap-2 mt-2">
                  <app-skeleton width="60px" height="1.5rem" />
                  <app-skeleton width="70px" height="1.5rem" />
                  <app-skeleton width="50px" height="1.5rem" />
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PortfolioGridSkeletonComponent {}
