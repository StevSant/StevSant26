import { Component, OnInit, signal, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { SkillUsage, Skill } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { SkillUsageListItemComponent } from './skill-usage-list-item/skill-usage-list-item.component';

@Component({
  selector: 'app-skill-usage-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, SkillUsageListItemComponent],
  templateUrl: './skill-usage-list.component.html',
})
export class SkillUsageListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
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
    } catch (err) { console.error('Error loading skill usages:', err); }
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
    const filtered = this.filteredItems();
    moveItemInArray(filtered, event.previousIndex, event.currentIndex);
    const updates = filtered.map((item, index) => ({ id: item.id, position: index }));
    try { await this.supabase.updatePositions('skill_usages', updates); await this.loadItems(); }
    catch (err) { console.error('Error updating positions:', err); }
  }

  async toggleArchive(item: SkillUsage): Promise<void> {
    try {
      if (item.is_archived) { await this.supabase.unarchive('skill_usages', item.id); }
      else { await this.supabase.archive('skill_usages', item.id); }
      await this.loadItems();
    } catch (err) { console.error('Error toggling archive:', err); }
  }

  confirmDelete(item: SkillUsage): void { this.itemToDelete = item; this.confirmDialog.open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.supabase.delete('skill_usages', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { console.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
