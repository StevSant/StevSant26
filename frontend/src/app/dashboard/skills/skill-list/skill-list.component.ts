import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '../../../core/services/supabase.service';
import { Skill } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent],
  templateUrl: './skill-list.component.html',
})
export class SkillListComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Skill[]>([]);
  itemToDelete: Skill | null = null;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> { await this.loadItems(); }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getSkillsWithCategories();
      if (error) throw error;
      this.items.set(data || []);
    } catch (err) { console.error('Error loading skills:', err); }
    finally { this.loading.set(false); }
  }

  filteredItems(): Skill[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void { this.showArchived.update((v) => !v); }

  async drop(event: CdkDragDrop<Skill[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try { await this.supabase.updatePositions('skill', updates); await this.loadItems(); }
    catch (err) { console.error('Error updating positions:', err); }
  }

  async togglePin(item: Skill): Promise<void> {
    try { await this.supabase.togglePin('skill', item.id, !item.is_pinned); await this.loadItems(); }
    catch (err) { console.error('Error toggling pin:', err); }
  }

  async toggleArchive(item: Skill): Promise<void> {
    try {
      if (item.is_archived) { await this.supabase.unarchive('skill', item.id); }
      else { await this.supabase.archive('skill', item.id); }
      await this.loadItems();
    } catch (err) { console.error('Error toggling archive:', err); }
  }

  confirmDelete(item: Skill): void { this.itemToDelete = item; this.confirmDialog.open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.supabase.delete('skill', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { console.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
