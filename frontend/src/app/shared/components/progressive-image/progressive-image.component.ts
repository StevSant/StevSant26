import {
  Component,
  input,
  signal,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Progressive image component that displays a blurred placeholder
 * and fades to sharp once the full image has loaded.
 *
 * Usage:
 *   <app-progressive-image
 *     src="https://example.com/image.jpg"
 *     alt="Description"
 *     containerClass="w-full h-40"
 *     imgClass="object-cover"
 *   />
 */
@Component({
  selector: 'app-progressive-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="'relative overflow-hidden ' + containerClass()">
      <!-- Blurred placeholder (uses same src with CSS blur until loaded) -->
      <div
        class="absolute inset-0 bg-(--color-bg-tertiary) transition-opacity duration-500"
        [class.opacity-0]="loaded()"
      >
        <div class="w-full h-full animate-pulse bg-(--color-bg-tertiary)"></div>
      </div>
      <!-- Full image -->
      <img
        [src]="src()"
        [alt]="alt()"
        [loading]="loading()"
        [decoding]="decoding()"
        [class]="'w-full h-full transition-all duration-500 ' + imgClass()"
        [style.filter]="loaded() ? 'blur(0)' : 'blur(20px)'"
        [style.transform]="loaded() ? 'scale(1)' : 'scale(1.1)'"
        (load)="onImageLoad()"
        (error)="onImageError()"
      />
    </div>
  `,
})
export class ProgressiveImageComponent implements AfterViewInit, OnDestroy {
  /** Full-resolution image URL */
  src = input.required<string>();
  /** Alt text for accessibility */
  alt = input<string>('');
  /** CSS classes for the container div */
  containerClass = input<string>('');
  /** CSS classes for the img element */
  imgClass = input<string>('');
  /** Loading strategy */
  loading = input<'lazy' | 'eager'>('lazy');
  /** Decoding strategy */
  decoding = input<'async' | 'sync' | 'auto'>('async');

  loaded = signal(false);

  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // If image is already cached and loaded immediately
    const img = this.el.nativeElement.querySelector('img');
    if (img?.complete && img.naturalWidth > 0) {
      this.loaded.set(true);
    }
  }

  onImageLoad(): void {
    this.loaded.set(true);
  }

  onImageError(): void {
    // Still remove blur on error to avoid stuck state
    this.loaded.set(true);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
