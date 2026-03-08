import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="scroll-progress-bar" [style.width.%]="progress()"></div>`,
  styles: [
    `
      .scroll-progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        z-index: 9999;
        background: var(--color-accent);
        transition: width 0.1s linear;
      }

      @media (prefers-reduced-motion: reduce) {
        .scroll-progress-bar {
          display: none;
        }
      }
    `,
  ],
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private scrollListener: (() => void) | null = null;
  private rafId: number | null = null;

  progress = signal(0);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.scrollListener = () => {
      if (this.rafId !== null) return;
      this.rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        this.progress.set(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
        this.rafId = null;
      });
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
