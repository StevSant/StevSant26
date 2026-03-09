import { Component, OnInit, signal, viewChild, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslateService } from '@core/services/translate.service';
import { Skill, SkillCategory } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import {
  DashboardFilterComponent,
  DashboardFilterOption,
} from '@shared/components/dashboard-filter/dashboard-filter.component';
import { SkillItemComponent } from './skill-item/skill-item.component';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { LoggerService } from '@core/services/logger.service';
import { CrudService, TranslationDataService } from '@core/services';
import { MatIcon } from '@angular/material/icon';
import { DashboardListSkeletonComponent } from '@shared/components/dashboard-list-skeleton/dashboard-list-skeleton.component';

@Component({
  selector: 'app-skill-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    ConfirmDialogComponent,
    TranslatePipe,
    DashboardFilterComponent,
    SkillItemComponent,
    MatIcon,
    PaginationComponent,
    DashboardListSkeletonComponent,
  ],
  templateUrl: './skill-list.component.html',
})
export class SkillListComponent implements OnInit {
  private crudService = inject(CrudService);
  private translationDataService = inject(TranslationDataService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Skill[]>([]);
  itemToDelete: Skill | null = null;

  // Pagination
  currentPage = signal(1);
  pageSize = 10;

  // Filter state
  searchText = signal('');
  selectedCategoryId = signal('');
  categoryFilterOptions = signal<DashboardFilterOption[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.translationDataService.getSkillsWithCategories<Skill>();
      if (error) throw error;
      this.items.set(data || []);
      this.buildCategoryOptions(data || []);
    } catch (err) {
      this.logger.error('Error loading skills:', err);
    } finally {
      this.loading.set(false);
    }
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
          const translation = cat.translations?.find((t) => t.language?.code === lang);
          const name = translation?.name || cat.translations?.[0]?.name || `Category #${cat.id}`;
          categoryMap.set(cat.id, name);
        }
      }
    }

    this.categoryFilterOptions.set(
      Array.from(categoryMap.entries()).map(([id, name]) => ({
        label: name,
        value: String(id),
      })),
    );
  }

  /**
   * Get the translated name for a skill
   */
  getItemName(item: Skill): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find((t) => t.language?.code === lang);
    return translation?.name || item.translations?.[0]?.name || `Skill #${item.id}`;
  }

  /**
   * Get the translated description for a skill
   */
  getItemDescription(item: Skill): string | null {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find((t) => t.language?.code === lang);
    return translation?.description || item.translations?.[0]?.description || null;
  }

  /**
   * Get the translated category name for a skill
   */
  getCategoryName(item: Skill): string | null {
    if (!item.skill_category) return null;
    const lang = this.translateService.currentLang();
    const translation = item.skill_category.translations?.find((t) => t.language?.code === lang);
    return translation?.name || item.skill_category.translations?.[0]?.name || null;
  }

  filteredItems(): Skill[] {
    const all = this.items();
    let filtered = this.showArchived()
      ? all.filter((i) => i.is_archived)
      : all.filter((i) => !i.is_archived);

    // Filter by category
    const categoryId = this.selectedCategoryId();
    if (categoryId) {
      filtered = filtered.filter((i) => String(i.skill_category_id) === categoryId);
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter((i) => {
        const name = this.getItemName(i).toLowerCase();
        const desc = (this.getItemDescription(i) || '').toLowerCase();
        const catName = (this.getCategoryName(i) || '').toLowerCase();
        return name.includes(search) || desc.includes(search) || catName.includes(search);
      });
    }

    return filtered;
  }

  paginatedItems(): Skill[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredItems().slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onSearchChange(text: string): void {
    this.searchText.set(text);
    this.currentPage.set(1);
  }
  onCategoryFilterChange(value: string): void {
    this.selectedCategoryId.set(value);
    this.currentPage.set(1);
  }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
    this.currentPage.set(1);
  }

  async drop(event: CdkDragDrop<Skill[]>): Promise<void> {
    const allItems = [...this.items()];
    const filtered = this.filteredItems();
    const movedItem = filtered[event.previousIndex];
    const targetItem = filtered[event.currentIndex];
    const fromIndex = allItems.indexOf(movedItem);
    const toIndex = allItems.indexOf(targetItem);
    if (fromIndex < 0 || toIndex < 0) return;
    moveItemInArray(allItems, fromIndex, toIndex);
    allItems.forEach((item, i) => ((item as any).position = i));
    this.items.set(allItems);
    const updates = allItems.map((item, i) => ({ id: item.id, position: i }));
    try {
      await this.crudService.updatePositions('skill', updates);
    } catch (err) {
      this.logger.error('Error updating positions:', err);
      await this.loadItems();
    }
  }

  async togglePin(item: Skill): Promise<void> {
    try {
      await this.crudService.togglePin('skill', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: Skill): Promise<void> {
    try {
      if (item.is_archived) {
        await this.crudService.unarchive('skill', item.id);
      } else {
        await this.crudService.archive('skill', item.id);
      }
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: Skill): void {
    this.itemToDelete = item;
    this.confirmDialog().open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.crudService.delete('skill', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
