import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { Project, ProjectTranslation } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  loading = signal(true);
  showArchived = signal(false);
  items = signal<Project[]>([]);
  itemToDelete: Project | null = null;

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getAllWithTranslations<Project>(
        'project',
        'project_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get the translated title for a project
   */
  getItemTitle(item: Project): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.title || item.translations?.[0]?.title || `Project #${item.id}`;
  }

  /**
   * Get the translated description for a project
   */
  getItemDescription(item: Project): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.description || item.translations?.[0]?.description || null;
  }

  filteredItems(): Project[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
  }

  async drop(event: CdkDragDrop<Project[]>): Promise<void> {
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);

    // Update positions
    const updates = filtered.map((item, index) => ({
      id: item.id,
      position: index,
    }));

    try {
      await this.supabase.updatePositions('project', updates);
      // Reload to get fresh data
      await this.loadItems();
    } catch (err) {
      console.error('Error updating positions:', err);
    }
  }

  async togglePin(item: Project): Promise<void> {
    try {
      await this.supabase.togglePin('project', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: Project): Promise<void> {
    try {
      if (item.is_archived) {
        await this.supabase.unarchive('project', item.id);
      } else {
        await this.supabase.archive('project', item.id);
      }
      await this.loadItems();
    } catch (err) {
      console.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: Project): void {
    this.itemToDelete = item;
    this.confirmDialog.open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.supabase.delete('project', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
