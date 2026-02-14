import { Component, input, output } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ExistingImage } from '../image-upload.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-image-upload-gallery',
  standalone: true,
  imports: [DragDropModule, MatIcon],
  templateUrl: './image-upload-gallery.component.html',
})
export class ImageUploadGalleryComponent {
  // Inputs
  uploadedImages = input<{ path: string; url: string; alt?: string }[]>([]);
  existingImages = input<ExistingImage[]>([]);

  // Outputs
  removeUploaded = output<string>();
  removeExisting = output<number>();
  reorderExisting = output<ExistingImage[]>();
  reorderUploaded = output<{ path: string; url: string; alt?: string }[]>();

  onRemoveUploaded(path: string, event: Event): void {
    event.stopPropagation();
    this.removeUploaded.emit(path);
  }

  onRemoveExisting(id: number, event: Event): void {
    event.stopPropagation();
    this.removeExisting.emit(id);
  }

  onDropExisting(event: CdkDragDrop<ExistingImage[]>): void {
    const items = [...this.existingImages()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.reorderExisting.emit(items);
  }

  onDropUploaded(event: CdkDragDrop<{ path: string; url: string; alt?: string }[]>): void {
    const items = [...this.uploadedImages()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.reorderUploaded.emit(items);
  }
}
