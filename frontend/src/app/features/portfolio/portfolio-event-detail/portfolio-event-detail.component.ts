import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Event } from '@core/models';

@Component({
  selector: 'app-portfolio-event-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe],
  template: `
    <section class="py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Back link -->
        <a routerLink="../" class="inline-flex items-center gap-2 text-sm text-(--color-text-muted) hover:text-(--color-accent) transition-colors mb-8">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          {{ 'portfolio.backToList' | translate }}
        </a>

        @if (event(); as evt) {
          <article>
            <!-- Header -->
            <div class="mb-8">
              <h1 class="text-3xl font-semibold text-(--color-text-primary) tracking-tight mb-2">
                {{ data.getEntityTranslation(evt, 'name') }}
              </h1>
              @if (evt.assisted_at) {
                <p class="text-sm text-(--color-text-muted) uppercase tracking-wider">
                  {{ evt.assisted_at | date: 'longDate' }}
                </p>
              }
            </div>

            <!-- Image Gallery -->
            @if (images().length > 0) {
              <div class="mb-10">
                <h2 class="text-xs uppercase tracking-[0.2em] text-(--color-text-muted) mb-4 font-medium">
                  {{ 'portfolio.gallery' | translate }}
                </h2>
                <div class="relative rounded-lg overflow-hidden mb-3 bg-(--color-bg-tertiary)">
                  <img
                    [src]="images()[selectedImageIndex()].url"
                    [alt]="images()[selectedImageIndex()].alt_text || data.getEntityTranslation(evt, 'name')"
                    class="w-full max-h-125 object-contain"
                  />
                </div>
                @if (images().length > 1) {
                  <div class="flex gap-2 overflow-x-auto pb-2">
                    @for (img of images(); track img.id; let i = $index) {
                      <button
                        type="button"
                        (click)="selectedImageIndex.set(i)"
                        class="shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all"
                        [class]="i === selectedImageIndex() ? 'border-(--color-accent) ring-2 ring-(--color-accent)/30' : 'border-(--color-border-primary) opacity-60 hover:opacity-100'"
                      >
                        <img [src]="img.url" [alt]="img.alt_text || ''" class="w-full h-full object-cover" />
                      </button>
                    }
                  </div>
                }
              </div>
            }

            <!-- Description -->
            @if (data.getEntityTranslation(evt, 'description')) {
              <div class="mb-10">
                <p class="text-(--color-text-secondary) leading-relaxed whitespace-pre-line">
                  {{ data.getEntityTranslation(evt, 'description') }}
                </p>
              </div>
            }

            <!-- Skills Used -->
            @if (data.getSkillUsages('event', evt.id).length > 0) {
              <div class="mb-10">
                <h2 class="text-xs uppercase tracking-[0.2em] text-(--color-text-muted) mb-4 font-medium">
                  {{ 'portfolio.skillsUsed' | translate }}
                </h2>
                <div class="flex flex-wrap gap-2">
                  @for (usage of data.getSkillUsages('event', evt.id); track usage.id) {
                    <span class="px-3 py-1 text-sm rounded-full bg-(--color-bg-tertiary) text-(--color-text-secondary) border border-(--color-border-primary)">
                      {{ data.getSkillName(usage) }}
                      @if (usage.level) {
                        <span class="text-(--color-text-muted) ml-1">&middot; {{ usage.level }}/5</span>
                      }
                    </span>
                  }
                </div>
              </div>
            }
          </article>
        } @else if (!data.loading()) {
          <div class="text-center py-20">
            <p class="text-(--color-text-muted) italic">{{ 'common.noResults' | translate }}</p>
          </div>
        }
      </div>
    </section>
  `,
})
export class PortfolioEventDetailComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private route = inject(ActivatedRoute);

  event = signal<Event | null>(null);
  images = signal<import('@core/models').Image[]>([]);
  selectedImageIndex = signal(0);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      const evt = this.data.getEventById(id);
      if (evt) {
        this.event.set(evt);
        this.images.set(this.data.getAllImages('event', id));
      }
    }
  }
}
