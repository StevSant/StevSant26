import { Component } from '@angular/core';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';

@Component({
  selector: 'app-portfolio-skills-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  template: `
    <section class="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <!-- Section title -->
        <div class="flex flex-col items-center gap-3 mb-8 sm:mb-10 lg:mb-14">
          <app-skeleton width="100px" height="0.75rem" />
          <div class="w-12 h-px bg-(--color-accent) opacity-60"></div>
        </div>

        <!-- View toggle placeholder -->
        <div class="flex justify-center mb-8">
          <app-skeleton width="200px" height="2rem" />
        </div>

        <!-- Category cards grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          @for (_ of [1, 2, 3, 4]; track $index) {
            <div
              class="bg-(--color-bg-secondary) rounded-xl border border-(--color-card-border) p-6"
            >
              <!-- Category header -->
              <div class="flex items-center gap-3 mb-5">
                <app-skeleton width="36px" height="36px" variant="circle" />
                <app-skeleton width="60%" height="1.25rem" />
              </div>
              <!-- Skill bars -->
              @for (_ of [1, 2, 3, 4]; track $index) {
                <div class="flex items-center gap-3 mb-3">
                  <app-skeleton width="24px" height="24px" variant="circle" />
                  <div class="flex-1 flex flex-col gap-1.5">
                    <div class="flex justify-between">
                      <app-skeleton width="40%" height="0.75rem" />
                      <app-skeleton width="30px" height="0.75rem" />
                    </div>
                    <app-skeleton width="100%" height="6px" />
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class PortfolioSkillsSkeletonComponent {}
