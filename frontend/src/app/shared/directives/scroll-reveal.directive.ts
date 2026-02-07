import { Directive, ElementRef, OnInit, OnDestroy, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true,
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private observer?: IntersectionObserver;

  /** Delay in ms before animation triggers (stagger support) */
  revealDelay = input<number>(0);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.el.nativeElement as HTMLElement;
    element.classList.add('scroll-reveal');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = this.revealDelay();
            if (delay > 0) {
              setTimeout(() => element.classList.add('scroll-reveal--visible'), delay);
            } else {
              element.classList.add('scroll-reveal--visible');
            }
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
