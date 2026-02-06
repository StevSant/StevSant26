import { Component, input, output } from '@angular/core';
import { ExistingImage } from '../image-upload.component';

@Component({
  selector: 'app-image-upload-gallery',
  standalone: true,
  templateUrl: './image-upload-gallery.component.html',
})
export class ImageUploadGalleryComponent {
  // Inputs
  uploadedImages = input<{ path: string; url: string; alt?: string }[]>([]);
  existingImages = input<ExistingImage[]>([]);

  // Outputs
  removeUploaded = output<string>();
  removeExisting = output<number>();

  onRemoveUploaded(path: string, event: Event): void {
    event.stopPropagation();
    this.removeUploaded.emit(path);
  }

  onRemoveExisting(id: number, event: Event): void {
    event.stopPropagation();
    this.removeExisting.emit(id);
  }
}
