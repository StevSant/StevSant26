import {
  Component,
  input,
  output,
  signal,
  computed,
  HostListener,
  ElementRef,
  inject,
  effect,
} from '@angular/core';
import { Image } from '@core/models';

@Component({
  selector: 'app-image-lightbox',
  standalone: true,
  templateUrl: './image-lightbox.component.html',
})
export class ImageLightboxComponent {
  private el = inject(ElementRef);

  /** All images to navigate through */
  images = input.required<Image[]>();

  /** The index of the image to show first */
  startIndex = input<number>(0);

  /** Fallback alt text */
  fallbackAlt = input<string>('');

  /** Emits when the lightbox should close */
  closed = output<void>();

  selectedIndex = signal(0);
  zoomed = signal(false);

  currentImage = computed(() => {
    const imgs = this.images();
    const idx = this.selectedIndex();
    return imgs.length > 0 ? imgs[idx] : null;
  });

  hasMultiple = computed(() => this.images().length > 1);

  constructor() {
    effect(() => {
      this.selectedIndex.set(this.startIndex());
    });
  }

  selectImage(index: number): void {
    this.zoomed.set(false);
    this.selectedIndex.set(index);
  }

  nextImage(): void {
    const imgs = this.images();
    if (imgs.length <= 1) return;
    this.zoomed.set(false);
    this.selectedIndex.update(i => (i + 1) % imgs.length);
  }

  prevImage(): void {
    const imgs = this.images();
    if (imgs.length <= 1) return;
    this.zoomed.set(false);
    this.selectedIndex.update(i => (i - 1 + imgs.length) % imgs.length);
  }

  toggleZoom(): void {
    this.zoomed.update(z => !z);
  }

  close(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('lightbox-backdrop')) {
      this.close();
    }
  }

  @HostListener('document:keydown.Escape')
  onEscape(): void {
    this.close();
  }

  @HostListener('document:keydown.ArrowRight', ['$event'])
  onArrowRight(event: Event): void {
    event.preventDefault();
    this.nextImage();
  }

  @HostListener('document:keydown.ArrowLeft', ['$event'])
  onArrowLeft(event: Event): void {
    event.preventDefault();
    this.prevImage();
  }
}
