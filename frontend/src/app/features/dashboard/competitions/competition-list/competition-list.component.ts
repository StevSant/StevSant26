import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { TranslateService } from '../../../../core/services/translate.service';
import { Competition, CompetitionTranslation } from '../../../../core/models';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-competition-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent],
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
    } catch (err) { console.error('Error loading competitions:', err); }
    finally { this.loading.set(false); }
  }

  /**
   * Get the translated name for a competition
   */
  getItemName(item: Competition): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language === lang);
    return translation?.name || item.translations?.[0]?.name || `Competition #${item.id}`;
  }

  /**
   * Get the translated result for a competition
   */
  getItemResult(item: Competition): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language === lang);
    return translation?.result || item.translations?.[0]?.result || null;
  }

  filteredItems(): Competition[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

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
