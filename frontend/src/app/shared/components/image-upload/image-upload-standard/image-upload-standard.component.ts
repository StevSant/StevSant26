import { Component, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload-standard',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './image-upload-standard.component.html',
})
export class ImageUploadStandardComponent {
  // Inputs
  uploading = input<boolean>(false);
  uploadProgress = input<number | null>(null);
  multiple = input<boolean>(false);
  previewUrl = input<string | null>(null);
  altText = input<string>('');

  // Outputs
  fileSelected = output<Event>();
  fileDrop = output<File[]>();
  removePreview = output<void>();

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

  onRemovePreview(event: Event): void {
    event.stopPropagation();
    this.removePreview.emit();
  }
}
