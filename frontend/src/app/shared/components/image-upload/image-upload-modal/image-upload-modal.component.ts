import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-image-upload-modal',
  standalone: true,
  templateUrl: './image-upload-modal.component.html',
})
export class ImageUploadModalComponent {
  // Inputs
  visible = input<boolean>(false);
  imageUrl = input<string | null>(null);
  altText = input<string>('');

  // Outputs
  close = output<void>();

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }
}
