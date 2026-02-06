import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-competitions',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe],
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
              <div class="group bg-(--color-bg-secondary) rounded-lg overflow-hidden border border-(--color-card-border) hover:border-(--color-accent)/30 transition-all duration-500 flex flex-col">
                <!-- Image -->
                @if (data.getFirstImageUrl('competition', comp.id)) {
                  <div class="relative h-40 overflow-hidden">
                    <img
                      [src]="data.getFirstImageUrl('competition', comp.id)"
                      [alt]="data.getEntityTranslation(comp, 'name')"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                }

                <div class="p-6 flex flex-col flex-1">
                  <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg font-medium text-(--color-text-primary) tracking-tight">
                      {{ data.getEntityTranslation(comp, 'name') }}
                    </h3>
                    @if (comp.date) {
                      <span class="text-xs text-(--color-text-muted) uppercase tracking-wider shrink-0 ml-2">
                        {{ comp.date | date }}
                      </span>
                    }
                  </div>
                  @if (data.getEntityTranslation(comp, 'result')) {
                    <p class="text-(--color-accent) text-sm font-medium mb-2 tracking-wide">
                      {{ data.getEntityTranslation(comp, 'result') }}
                    </p>
                  }
                  @if (data.getEntityTranslation(comp, 'description')) {
                    <p class="text-sm text-(--color-text-muted) line-clamp-3 mb-3 leading-relaxed font-light">
                      {{ data.getEntityTranslation(comp, 'description') }}
                    </p>
                  }
                  @if (comp.organizer) {
                    <p class="text-sm text-(--color-text-muted) font-light mt-auto">{{ comp.organizer }}</p>
                  }
                  <!-- Skills -->
                  @if (data.getSkillUsages('competition', comp.id).length > 0) {
                    <div class="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-(--color-divider)">
                      @for (usage of data.getSkillUsages('competition', comp.id).slice(0, 5); track usage.id) {
                        <span class="px-2 py-0.5 text-xs rounded-full bg-(--color-bg-tertiary) text-(--color-text-secondary) border border-(--color-border-primary)">
                          {{ data.getSkillName(usage) }}
                        </span>
                      }
                      @if (data.getSkillUsages('competition', comp.id).length > 5) {
                        <span class="px-2 py-0.5 text-xs rounded-full bg-(--color-bg-tertiary) text-(--color-text-muted)">
                          +{{ data.getSkillUsages('competition', comp.id).length - 5 }}
                        </span>
                      }
                    </div>
                  }
                  <!-- View Details -->
                  <div class="mt-4 pt-3 border-t border-(--color-divider)">
                    <a
                      [routerLink]="[comp.id]"
                      class="text-xs uppercase tracking-widest text-(--color-text-muted) hover:text-(--color-accent) flex items-center gap-1.5 transition-colors"
                    >
                      {{ 'portfolio.viewDetails' | translate }}
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
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
export class PortfolioCompetitionsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
