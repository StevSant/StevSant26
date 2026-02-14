import { Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslationDataService } from '@core/services/translation-data.service';
import { CrudService } from '@core/services/crud.service';
import { TranslateService } from '@core/services/translate.service';
import { Event, EventTranslation, Image } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DashboardFilterComponent, DashboardFilterOption } from '@shared/components/dashboard-filter/dashboard-filter.component';
import { EventItemComponent } from './event-item/event-item.component';
import { LoggerService } from '@core/services/logger.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe, DashboardFilterComponent, EventItemComponent, MatIcon],
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {
  private translationData = inject(TranslationDataService);
  private crud = inject(CrudService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');

  loading = signal(true);
  showArchived = signal(false);
  items = signal<Event[]>([]);
  itemToDelete: Event | null = null;
  imageMap = new Map<number, string>();

  // Filter state
  searchText = signal('');
  selectedYear = signal('');
  yearFilterOptions = signal<DashboardFilterOption[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.translationData.getAllWithTranslations<Event>(
        'event',
        'event_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
      this.buildYearOptions(data || []);
      await this.loadImages(data || []);
    } catch (err) {
      this.logger.error('Error loading events:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Build unique year filter options from event dates
   */
  private buildYearOptions(events: Event[]): void {
    const years = new Set<string>();
    for (const evt of events) {
      if (evt.assisted_at) {
        const year = new Date(evt.assisted_at).getFullYear().toString();
        years.add(year);
      }
    }
    this.yearFilterOptions.set(
      Array.from(years).sort((a, b) => b.localeCompare(a)).map(y => ({ label: y, value: y }))
    );
  }

  /**
   * Get the translated name for an event
   */
  private async loadImages(items: Event[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map(i => i.id);
    const { data } = await this.crud
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
    let filtered = this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);

    // Filter by year
    const year = this.selectedYear();
    if (year) {
      filtered = filtered.filter(i => {
        if (!i.assisted_at) return false;
        return new Date(i.assisted_at).getFullYear().toString() === year;
      });
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(i => {
        const name = this.getItemName(i).toLowerCase();
        const desc = (this.getItemDescription(i) || '').toLowerCase();
        return name.includes(search) || desc.includes(search);
      });
    }

    return filtered;
  }

  onSearchChange(text: string): void { this.searchText.set(text); }
  onYearFilterChange(value: string): void { this.selectedYear.set(value); }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
  }

  async drop(event: CdkDragDrop<Event[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try {
      await this.crud.updatePositions('event', updates);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error updating positions:', err);
    }
  }

  async togglePin(item: Event): Promise<void> {
    try {
      await this.crud.togglePin('event', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: Event): Promise<void> {
    try {
      if (item.is_archived) {
        await this.crud.unarchive('event', item.id);
      } else {
        await this.crud.archive('event', item.id);
      }
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: Event): void {
    this.itemToDelete = item;
    this.confirmDialog().open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.crud.delete('event', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
