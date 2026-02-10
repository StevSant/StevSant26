import { Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { SkillUsage, Skill } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SkillUsageListItemComponent } from './skill-usage-list-item/skill-usage-list-item.component';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-skill-usage-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, SkillUsageListItemComponent],
  templateUrl: './skill-usage-list.component.html',
})
export class SkillUsageListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');
  loading = signal(true);
  showArchived = signal(false);
  items = signal<SkillUsage[]>([]);
  itemToDelete: SkillUsage | null = null;

  async ngOnInit(): Promise<void> { await this.loadItems(); }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getSkillUsagesWithSkills<SkillUsage>();
      if (error) throw error;
      this.items.set(data || []);
    } catch (err) { this.logger.error('Error loading skill usages:', err); }
    finally { this.loading.set(false); }
  }

  /**
   * Get the translated name for a skill
   */
  getSkillName(item: SkillUsage): string {
    if (!item.skill) return `Skill #${item.skill_id}`;
    const lang = this.translateService.currentLang();
    const translation = item.skill.translations?.find(t => t.language?.code === lang);
    return translation?.name || item.skill.translations?.[0]?.name || `Skill #${item.skill_id}`;
  }

  filteredItems(): SkillUsage[] {
    const all = this.items();
    return this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);
  }

  toggleShowArchived(): void { this.showArchived.update((v) => !v); }

  async drop(event: CdkDragDrop<SkillUsage[]>): Promise<void> {
    const allItems = [...this.items()];
    const filtered = this.filteredItems();
    const movedItem = filtered[event.previousIndex];
    const targetItem = filtered[event.currentIndex];
    const fromIndex = allItems.indexOf(movedItem);
    const toIndex = allItems.indexOf(targetItem);
    if (fromIndex < 0 || toIndex < 0) return;
    moveItemInArray(allItems, fromIndex, toIndex);
    allItems.forEach((item, i) => (item as any).position = i);
    this.items.set(allItems);
    const updates = allItems.map((item, i) => ({ id: item.id, position: i }));
    try { await this.supabase.updatePositions('skill_usages', updates); }
    catch (err) { this.logger.error('Error updating positions:', err); await this.loadItems(); }
  }

  async toggleArchive(item: SkillUsage): Promise<void> {
    try {
      if (item.is_archived) { await this.supabase.unarchive('skill_usages', item.id); }
      else { await this.supabase.archive('skill_usages', item.id); }
      await this.loadItems();
    } catch (err) { this.logger.error('Error toggling archive:', err); }
  }

  confirmDelete(item: SkillUsage): void { this.itemToDelete = item; this.confirmDialog().open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.supabase.delete('skill_usages', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { this.logger.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
