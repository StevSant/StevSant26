import { Component, OnInit, signal, ViewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { Skill, SkillCategory } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DashboardFilterComponent, DashboardFilterOption } from '@shared/components/dashboard-filter/dashboard-filter.component';
import { SkillItemComponent } from './skill-item/skill-item.component';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe, DashboardFilterComponent, SkillItemComponent],
  templateUrl: './skill-list.component.html',
})
export class SkillListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);

  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Skill[]>([]);
  itemToDelete: Skill | null = null;

  // Filter state
  searchText = signal('');
  selectedCategoryId = signal('');
  categoryFilterOptions = signal<DashboardFilterOption[]>([]);

  async ngOnInit(): Promise<void> { await this.loadItems(); }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase.getSkillsWithCategories<Skill>();
      if (error) throw error;
      this.items.set(data || []);
      this.buildCategoryOptions(data || []);
    } catch (err) { console.error('Error loading skills:', err); }
    finally { this.loading.set(false); }
  }

  /**
   * Build unique category filter options from loaded skills
   */
  private buildCategoryOptions(skills: Skill[]): void {
    const lang = this.translateService.currentLang();
    const categoryMap = new Map<number, string>();

    for (const skill of skills) {
      if (skill.skill_category) {
        const cat = skill.skill_category;
        if (!categoryMap.has(cat.id)) {
          const translation = cat.translations?.find(t => t.language?.code === lang);
          const name = translation?.name || cat.translations?.[0]?.name || `Category #${cat.id}`;
          categoryMap.set(cat.id, name);
        }
      }
    }

    this.categoryFilterOptions.set(
      Array.from(categoryMap.entries()).map(([id, name]) => ({
        label: name,
        value: String(id),
      }))
    );
  }

  /**
   * Get the translated name for a skill
   */
  getItemName(item: Skill): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.name || item.translations?.[0]?.name || `Skill #${item.id}`;
  }

  /**
   * Get the translated description for a skill
   */
  getItemDescription(item: Skill): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.description || item.translations?.[0]?.description || null;
  }

  /**
   * Get the translated category name for a skill
   */
  getCategoryName(item: Skill): string | null {
    if (!item.skill_category) return null;
    const lang = this.translateService.currentLang();
    const translation = item.skill_category.translations?.find(t => t.language?.code === lang);
    return translation?.name || item.skill_category.translations?.[0]?.name || null;
  }

  filteredItems(): Skill[] {
    const all = this.items();
    let filtered = this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);

    // Filter by category
    const categoryId = this.selectedCategoryId();
    if (categoryId) {
      filtered = filtered.filter(i => String(i.skill_category_id) === categoryId);
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(i => {
        const name = this.getItemName(i).toLowerCase();
        const desc = (this.getItemDescription(i) || '').toLowerCase();
        const catName = (this.getCategoryName(i) || '').toLowerCase();
        return name.includes(search) || desc.includes(search) || catName.includes(search);
      });
    }

    return filtered;
  }

  onSearchChange(text: string): void { this.searchText.set(text); }
  onCategoryFilterChange(value: string): void { this.selectedCategoryId.set(value); }

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
