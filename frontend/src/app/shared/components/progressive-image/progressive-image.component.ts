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
  templateUrl: './progressive-image.component.html',
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
