import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-competitions',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe],
  template: `
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-sm uppercase tracking-[0.3em] text-(--color-text-muted) mb-3 text-center font-medium">
          {{ 'portfolio.sections.competitions' | translate }}
        </h2>
        <div class="w-12 h-px bg-(--color-accent) mx-auto mb-14 opacity-60"></div>

        @if (data.competitions().length === 0) {
          <div class="text-center py-12">
            <svg class="w-16 h-16 mx-auto mb-4 text-(--color-text-muted) opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <p class="text-(--color-text-muted) italic font-light">
              {{ 'portfolio.empty.competitions' | translate }}
            </p>
          </div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            @for (comp of data.competitions(); track comp.id) {
              <div class="bg-(--color-bg-secondary) rounded-lg p-6 border border-(--color-card-border) hover:border-(--color-accent)/30 transition-all duration-500">
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-lg font-medium text-(--color-text-primary) tracking-tight">
                    {{ data.getEntityTranslation(comp, 'name') }}
                  </h3>
                  @if (comp.date) {
                    <span class="text-xs text-(--color-text-muted) uppercase tracking-wider">
                      {{ comp.date | date }}
                    </span>
                  }
                </div>
                @if (data.getEntityTranslation(comp, 'result')) {
                  <p class="text-(--color-accent) text-sm font-medium mb-2 tracking-wide">
                    {{ data.getEntityTranslation(comp, 'result') }}
                  </p>
                }
                @if (comp.organizer) {
                  <p class="text-sm text-(--color-text-muted) font-light">{{ comp.organizer }}</p>
                }
              </div>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class PortfolioCompetitionsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
