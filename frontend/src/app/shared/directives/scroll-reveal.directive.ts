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

  /** Animation variant: 'default' | 'slide-left' | 'slide-right' | 'scale' | 'blur' | 'fade' */
  revealVariant = input<string>('default');

  /** Enable subtle parallax movement on scroll */
  revealParallax = input<boolean>(false);

  /** Parallax speed factor (default 0.05 for subtle effect) */
  revealParallaxSpeed = input<number>(0.05);

  private scrollHandler?: () => void;
  private rafId?: number;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const element = this.el.nativeElement as HTMLElement;
    const variant = this.revealVariant();

    if (variant === 'slide-left') {
      element.classList.add('scroll-reveal--slide-left');
    } else if (variant === 'slide-right') {
      element.classList.add('scroll-reveal--slide-right');
    } else if (variant === 'scale') {
      element.classList.add('scroll-reveal--scale');
    } else if (variant === 'blur') {
      element.classList.add('scroll-reveal--blur');
    } else if (variant === 'fade') {
      element.classList.add('scroll-reveal--fade');
    } else {
      element.classList.add('scroll-reveal');
    }

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

    // Parallax effect (only applied to elements that don't use reveal variants)
    if (this.revealParallax() && variant === 'default') {
      const speed = this.revealParallaxSpeed();
      let ticking = false;

      this.scrollHandler = () => {
        if (!ticking) {
          ticking = true;
          this.rafId = requestAnimationFrame(() => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const elementCenter = rect.top + rect.height / 2;
            const offset = (elementCenter - windowHeight / 2) * speed;
            element.style.transform = `translateY(${offset}px)`;
            ticking = false;
          });
        }
      };
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
