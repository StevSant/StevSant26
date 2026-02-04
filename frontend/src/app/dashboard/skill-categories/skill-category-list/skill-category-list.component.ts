import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '../../../core/services/supabase.service';
import { SkillCategory } from '../../../core/models';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-skill-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent],
  templateUrl: './skill-category-list.component.html',
})
export class SkillCategoryListComponent implements OnInit {
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  loading = signal(true);
  showArchived = signal(false);
  items = signal<SkillCategory[]>([]);
  itemToDelete: SkillCategory | null = null;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getAll<SkillCategory>('skill_category', 'position', true);
      if (error) throw error;
      this.items.set(data || []);
    } catch (err) {
      console.error('Error loading skill categories:', err);
    } finally {
      this.loading.set(false);
    }
  }

  filteredItems(): SkillCategory[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
  }

  async drop(event: CdkDragDrop<SkillCategory[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try {
      await this.supabase.updatePositions('skill_category', updates);
      await this.loadItems();
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  }

  async togglePin(item: SkillCategory): Promise<void> {
    try {
      await this.supabase.togglePin('skill_category', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: SkillCategory): Promise<void> {
    try {
      if (item.is_archived) {
        await this.supabase.unarchive('skill_category', item.id);
      } else {
        await this.supabase.archive('skill_category', item.id);
      }
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: SkillCategory): void {
    this.itemToDelete = item;
    this.confirmDialog.open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.supabase.delete('skill_category', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
