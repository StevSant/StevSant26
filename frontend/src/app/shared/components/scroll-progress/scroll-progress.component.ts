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
  template: `<div class="scroll-progress-track"><div class="scroll-progress-bar" [style.transform]="'scaleX(' + progress() / 100 + ')'"></div></div>`,
  styles: [
    `
      .scroll-progress-track {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        z-index: 9999;
        pointer-events: none;
      }

      .scroll-progress-bar {
        height: 100%;
        background: var(--color-accent);
        transform-origin: left;
        opacity: 0.7;
        will-change: transform;
      }

      @media (prefers-reduced-motion: reduce) {
        .scroll-progress-track {
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
