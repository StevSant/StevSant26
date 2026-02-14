import { Component, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload-avatar',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './image-upload-avatar.component.html',
})
export class ImageUploadAvatarComponent {
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
