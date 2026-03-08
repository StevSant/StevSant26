import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-not-found',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  template: `
    <section class="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p
        class="text-[8rem] sm:text-[12rem] font-bold leading-none text-(--color-accent) opacity-20 select-none"
      >
        404
      </p>
      <h1 class="text-2xl sm:text-3xl font-semibold text-(--color-text-primary) -mt-8 mb-4 tracking-tight">
        {{ 'portfolio.notFound.title' | translate }}
      </h1>
      <p class="text-(--color-text-muted) text-base max-w-md mb-8 font-light leading-relaxed">
        {{ 'portfolio.notFound.message' | translate }}
      </p>
      <a
        routerLink="/"
        class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-(--color-accent) text-(--btn-primary-text) text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
      >
        {{ 'portfolio.notFound.backHome' | translate }}
      </a>
    </section>
  `,
})
export class PortfolioNotFoundComponent {}
