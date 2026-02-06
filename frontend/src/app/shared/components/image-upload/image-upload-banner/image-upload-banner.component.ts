import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-image-upload-banner',
  standalone: true,
  templateUrl: './image-upload-banner.component.html',
})
export class ImageUploadBannerComponent {
  // Inputs
  currentImageUrl = input<string | null>(null);
  altText = input<string>('');
  uploading = input<boolean>(false);

  // Outputs
  viewImage = output<void>();
  fileSelected = output<Event>();
  fileDrop = output<File[]>();
  removeImage = output<void>();

  // Internal state
  isDragging = signal(false);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDrop.emit(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    this.fileSelected.emit(event);
  }

  onViewImage(event: Event): void {
    event.stopPropagation();
    this.viewImage.emit();
  }

  onRemoveImage(event: Event): void {
    event.stopPropagation();
    this.removeImage.emit();
  }
}
