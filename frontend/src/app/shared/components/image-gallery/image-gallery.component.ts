import { Component, input, signal, computed, HostListener, ElementRef, inject } from '@angular/core';
import { Image } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-image-gallery',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './image-gallery.component.html',
})
export class ImageGalleryComponent {
  private el = inject(ElementRef);

  /** The images to display */
  images = input.required<Image[]>();

  /** Fallback alt text when image has no alt_text */
  fallbackAlt = input<string>('');

  /** Whether to show the gallery title */
  showTitle = input<boolean>(true);

  selectedIndex = signal(0);

  currentImage = computed(() => {
    const imgs = this.images();
    const idx = this.selectedIndex();
    return imgs.length > 0 ? imgs[idx] : null;
  });

  hasMultiple = computed(() => this.images().length > 1);

  selectImage(index: number): void {
    this.selectedIndex.set(index);
  }

  nextImage(): void {
    const imgs = this.images();
    if (imgs.length <= 1) return;
    this.selectedIndex.update(i => (i + 1) % imgs.length);
  }

  prevImage(): void {
    const imgs = this.images();
    if (imgs.length <= 1) return;
    this.selectedIndex.update(i => (i - 1 + imgs.length) % imgs.length);
  }

  @HostListener('keydown.ArrowRight', ['$event'])
  onArrowRight(event: any): void {
    event.preventDefault();
    this.nextImage();
  }

  @HostListener('keydown.ArrowLeft', ['$event'])
  onArrowLeft(event: any): void {
    event.preventDefault();
    this.prevImage();
  }

  /** Reset index when images change (called by parent) */
  reset(): void {
    this.selectedIndex.set(0);
  }
}
