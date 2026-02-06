import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { Event, EventTranslation, Image } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  loading = signal(true);
  showArchived = signal(false);
  items = signal<Event[]>([]);
  itemToDelete: Event | null = null;
  imageMap = new Map<number, string>();

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getAllWithTranslations<Event>(
        'event',
        'event_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
      await this.loadImages(data || []);
    } catch (err) {
      console.error('Error loading events:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get the translated name for an event
   */
  private async loadImages(items: Event[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map(i => i.id);
    const { data } = await this.supabase
      .from('image')
      .select('*')
      .eq('source_type', 'event')
      .in('source_id', ids)
      .eq('is_archived', false)
      .order('position', { ascending: true });
    if (data) {
      this.imageMap.clear();
      for (const img of data as Image[]) {
        if (img.source_id && !this.imageMap.has(img.source_id)) {
          this.imageMap.set(img.source_id, img.url);
        }
      }
    }
  }

  getItemName(item: Event): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.name || item.translations?.[0]?.name || `Event #${item.id}`;
  }

  getItemDescription(item: Event): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.description || item.translations?.[0]?.description || null;
  }

  filteredItems(): Event[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
  }

  async drop(event: CdkDragDrop<Event[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try {
      await this.supabase.updatePositions('event', updates);
      await this.loadItems();
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  }

  async togglePin(item: Event): Promise<void> {
    try {
      await this.supabase.togglePin('event', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: Event): Promise<void> {
    try {
      if (item.is_archived) {
        await this.supabase.unarchive('event', item.id);
      } else {
        await this.supabase.archive('event', item.id);
      }
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: Event): void {
    this.itemToDelete = item;
    this.confirmDialog.open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.supabase.delete('event', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
