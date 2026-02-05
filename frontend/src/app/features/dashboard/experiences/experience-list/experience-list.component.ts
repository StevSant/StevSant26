import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { Experience, ExperienceTranslation } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent],
  templateUrl: './experience-list.component.html',
})
export class ExperienceListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Experience[]>([]);
  itemToDelete: Experience | null = null;

  async ngOnInit(): Promise<void> { await this.loadItems(); }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getAllWithTranslations<Experience>(
        'experience',
        'experience_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
    } catch (err) { console.error('Error loading experiences:', err); }
    finally { this.loading.set(false); }
  }

  /**
   * Get the translated role for an experience
   */
  getItemRole(item: Experience): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.role || item.translations?.[0]?.role || `Experience #${item.id}`;
  }

  filteredItems(): Experience[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void { this.showArchived.update((v) => !v); }

  async drop(event: CdkDragDrop<Experience[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try { await this.supabase.updatePositions('experience', updates); await this.loadItems(); }
    catch (err) { console.error('Error updating positions:', err); }
  }

  async togglePin(item: Experience): Promise<void> {
    try { await this.supabase.togglePin('experience', item.id, !item.is_pinned); await this.loadItems(); }
    catch (err) { console.error('Error toggling pin:', err); }
  }

  async toggleArchive(item: Experience): Promise<void> {
    try {
      if (item.is_archived) { await this.supabase.unarchive('experience', item.id); }
      else { await this.supabase.archive('experience', item.id); }
      await this.loadItems();
    } catch (err) { console.error('Error toggling archive:', err); }
  }

  confirmDelete(item: Experience): void { this.itemToDelete = item; this.confirmDialog.open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.supabase.delete('experience', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { console.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
