import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    @for (_ of countArray(); track $index) {
      <div
        class="skeleton-shimmer"
        [style.width]="width()"
        [style.height]="height()"
        [class.rounded-full]="variant() === 'circle'"
        [class.rounded-xl]="variant() === 'card' || variant() === 'image'"
        [class.rounded]="variant() === 'text'"
      ></div>
    }
  `,
})
export class SkeletonComponent {
  variant = input<'text' | 'circle' | 'card' | 'image'>('text');
  width = input<string>('100%');
  height = input<string>('1rem');
  count = input<number>(1);

  countArray = () => Array.from({ length: this.count() });
}
