import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { Competition, CompetitionTranslation, Image } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DashboardFilterComponent, DashboardFilterOption } from '@shared/components/dashboard-filter/dashboard-filter.component';
import { CompetitionItemComponent } from './competition-item/competition-item.component';

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe, DashboardFilterComponent, CompetitionItemComponent],
  templateUrl: './competition-list.component.html',
})
export class CompetitionListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Competition[]>([]);
  itemToDelete: Competition | null = null;
  imageMap = new Map<number, string>();

  // Filter state
  searchText = signal('');
  selectedOrganizer = signal('');
  organizerFilterOptions = signal<DashboardFilterOption[]>([]);

  async ngOnInit(): Promise<void> { await this.loadItems(); }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getAllWithTranslations<Competition>(
        'competitions',
        'competitions_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
      this.buildOrganizerOptions(data || []);
      await this.loadImages(data || []);
    } catch (err) { console.error('Error loading competitions:', err); }
    finally { this.loading.set(false); }
  }

  /**
   * Get the translated name for a competition
   */
  private async loadImages(items: Competition[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map(i => i.id);
    const { data } = await this.supabase
      .from('image')
      .select('*')
      .eq('source_type', 'competition')
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

  getItemName(item: Competition): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.name || item.translations?.[0]?.name || `Competition #${item.id}`;
  }

  /**
   * Build unique organizer filter options
   */
  private buildOrganizerOptions(competitions: Competition[]): void {
    const organizers = new Set<string>();
    for (const comp of competitions) {
      if (comp.organizer) organizers.add(comp.organizer);
    }
    this.organizerFilterOptions.set(
      Array.from(organizers).sort().map(o => ({ label: o, value: o }))
    );
  }

  /**
   * Get the translated result for a competition
   */
  getItemResult(item: Competition): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.result || item.translations?.[0]?.result || null;
  }

  getItemDescription(item: Competition): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.description || item.translations?.[0]?.description || null;
  }

  filteredItems(): Competition[] {
    const all = this.items();
    let filtered = this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);

    // Filter by organizer
    const organizer = this.selectedOrganizer();
    if (organizer) {
      filtered = filtered.filter(i => i.organizer === organizer);
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(i => {
        const name = this.getItemName(i).toLowerCase();
        const desc = (this.getItemDescription(i) || '').toLowerCase();
        const org = (i.organizer || '').toLowerCase();
        const result = (this.getItemResult(i) || '').toLowerCase();
        return name.includes(search) || desc.includes(search) || org.includes(search) || result.includes(search);
      });
    }

    return filtered;
  }

  onSearchChange(text: string): void { this.searchText.set(text); }
  onOrganizerFilterChange(value: string): void { this.selectedOrganizer.set(value); }

  toggleShowArchived(): void { this.showArchived.update((v) => !v); }

  async drop(event: CdkDragDrop<Competition[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try { await this.supabase.updatePositions('competitions', updates); await this.loadItems(); }
    catch (err) { console.error('Error updating positions:', err); }
  }

  async togglePin(item: Competition): Promise<void> {
    try { await this.supabase.togglePin('competitions', item.id, !item.is_pinned); await this.loadItems(); }
    catch (err) { console.error('Error toggling pin:', err); }
  }

  async toggleArchive(item: Competition): Promise<void> {
    try {
      if (item.is_archived) { await this.supabase.unarchive('competitions', item.id); }
      else { await this.supabase.archive('competitions', item.id); }
      await this.loadItems();
    } catch (err) { console.error('Error toggling archive:', err); }
  }

  confirmDelete(item: Competition): void { this.itemToDelete = item; this.confirmDialog.open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.supabase.delete('competitions', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { console.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
