import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-experience',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-sm uppercase tracking-[0.3em] text-(--color-text-muted) mb-3 text-center font-medium">
          {{ 'portfolio.sections.experience' | translate }}
        </h2>
        <div class="w-12 h-px bg-(--color-accent) mx-auto mb-14 opacity-60"></div>

        @if (data.experiences().length === 0) {
          <p class="text-(--color-text-muted) text-center italic font-light">
            {{ 'portfolio.empty.experience' | translate }}
          </p>
        } @else {
          <div class="relative">
            <!-- Timeline line -->
            <div class="absolute left-0 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-px bg-(--color-divider)"></div>

            @for (exp of data.experiences(); track exp.id; let i = $index) {
              <div class="relative mb-10 md:mb-14">
                <!-- Timeline dot -->
                <div class="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full bg-(--color-accent) ring-4 ring-(--color-bg-primary)"></div>

                <!-- Content -->
                <div
                  class="ml-8 md:ml-0"
                  [class.md:pr-14]="i % 2 === 0"
                  [class.md:pl-14]="i % 2 !== 0"
                  [class.md:w-1/2]="true"
                  [class.md:ml-auto]="i % 2 !== 0"
                >
                  <div class="bg-(--color-bg-secondary) rounded-lg p-6 border border-(--color-card-border)">
                    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 class="text-lg font-medium text-(--color-text-primary) tracking-tight">
                          {{ data.getEntityTranslation(exp, 'role') }}
                        </h3>
                        <p class="text-(--color-accent) text-sm font-medium tracking-wide">
                          {{ exp.company }}
                        </p>
                      </div>
                      <span class="text-xs text-(--color-text-muted) whitespace-nowrap uppercase tracking-wider mt-1">
                        {{ data.formatDateRange(exp.start_date, exp.end_date) }}
                      </span>
                    </div>
                    @if (data.getEntityTranslation(exp, 'description')) {
                      <p class="text-sm text-(--color-text-secondary) leading-relaxed font-light">
                        {{ data.getEntityTranslation(exp, 'description') }}
                      </p>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class PortfolioExperienceComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
