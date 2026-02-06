import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-events',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe],
  template: `
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-sm uppercase tracking-[0.3em] text-(--color-text-muted) mb-3 text-center font-medium">
          {{ 'portfolio.sections.events' | translate }}
        </h2>
        <div class="w-12 h-px bg-(--color-accent) mx-auto mb-14 opacity-60"></div>

        @if (data.events().length === 0) {
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-(--color-text-muted) opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-(--color-text-muted) italic font-light">
              {{ 'portfolio.empty.events' | translate }}
            </p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (event of data.events(); track event.id) {
              <div class="group bg-(--color-bg-secondary) rounded-lg overflow-hidden border border-(--color-card-border) hover:border-(--color-accent)/30 transition-all duration-500 flex flex-col">
                <!-- Image -->
                @if (data.getFirstImageUrl('event', event.id)) {
                  <div class="relative h-40 overflow-hidden">
                    <img
                      [src]="data.getFirstImageUrl('event', event.id)"
                      [alt]="data.getEntityTranslation(event, 'name')"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                }

                <div class="p-6 flex flex-col flex-1">
                  <h3 class="text-lg font-medium text-(--color-text-primary) mb-2 tracking-tight">
                    {{ data.getEntityTranslation(event, 'name') }}
                  </h3>
                  @if (event.assisted_at) {
                    <p class="text-xs text-(--color-text-muted) uppercase tracking-wider mb-3">
                      {{ event.assisted_at | date: 'mediumDate' }}
                    </p>
                  }
                  @if (data.getEntityTranslation(event, 'description')) {
                    <p class="text-sm text-(--color-text-muted) line-clamp-3 leading-relaxed font-light">
                      {{ data.getEntityTranslation(event, 'description') }}
                    </p>
                  }
                  <!-- Skills -->
                  @if (data.getSkillUsages('event', event.id).length > 0) {
                    <div class="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-(--color-divider)">
                      @for (usage of data.getSkillUsages('event', event.id).slice(0, 5); track usage.id) {
                        <span class="px-2 py-0.5 text-xs rounded-full bg-(--color-bg-tertiary) text-(--color-text-secondary) border border-(--color-border-primary)">
                          {{ data.getSkillName(usage) }}
                        </span>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class PortfolioEventsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
