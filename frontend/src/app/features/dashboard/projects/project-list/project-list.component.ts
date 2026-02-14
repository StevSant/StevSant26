import { Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslateService } from '@core/services/translate.service';
import { Project, ProjectTranslation, Image } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DashboardFilterComponent, DashboardFilterOption } from '@shared/components/dashboard-filter/dashboard-filter.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { LoggerService } from '@core/services/logger.service';
import { CrudService, TranslationDataService } from '@core/services';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe, DashboardFilterComponent, ProjectItemComponent, MatIcon],
  templateUrl: './project-list.component.html',
})
export class ProjectListComponent implements OnInit {
    private crudService = inject(CrudService);
    private translationDataService = inject(TranslationDataService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');

  loading = signal(true);
  showArchived = signal(false);
  items = signal<Project[]>([]);
  itemToDelete: Project | null = null;
  imageMap = new Map<number, string>();

  // Expanded parent projects (track which parents are expanded)
  expandedParents = signal<Set<number>>(new Set());

  // Filter state
  searchText = signal('');
  selectedSourceType = signal('');
  sourceTypeFilterOptions: DashboardFilterOption[] = [];

  async ngOnInit(): Promise<void> {
    this.sourceTypeFilterOptions = [
      { label: this.translateService.instant('projects.sourceTypes.experience'), value: 'experience' },
      { label: this.translateService.instant('projects.sourceTypes.competition'), value: 'competition' },
      { label: this.translateService.instant('projects.sourceTypes.event'), value: 'event' },
      { label: this.translateService.instant('projects.noSource'), value: 'none' },
    ];
    await this.loadItems();
  }

  async loadItems(): Promise<void> {
    this.loading.set(true);
    try {
      const { data, error } = await this.translationDataService.getAllWithTranslations<Project>(
        'project',
        'project_translation',
        'position',
        true
      );
      if (error) throw error;
      this.items.set(data || []);
      await this.loadImages(data || []);
    } catch (err) {
      this.logger.error('Error loading projects:', err);
    } finally {
      this.loading.set(false);
    }
  }

  /**
   * Get the translated title for a project
   */
  private async loadImages(items: Project[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map(i => i.id);
    const { data } = await this.crudService
      .from('image')
      .select('*')
      .eq('source_type', 'project')
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

  getParentTitle(item: Project): string | null {
    if (!item.parent_project_id) return null;
    const parent = this.items().find(p => p.id === item.parent_project_id);
    return parent ? this.getItemTitle(parent) : null;
  }

  getSubProjectCount(item: Project): number {
    return this.items().filter(p => p.parent_project_id === item.id).length;
  }

  filteredItems(): Project[] {
    const all = this.items();
    // Only show parent projects and independent projects (no parent_project_id)
    let filtered = all.filter((i) => !i.parent_project_id);

    // Apply archived filter
    filtered = this.showArchived() ? filtered.filter((i) => i.is_archived) : filtered.filter((i) => !i.is_archived);

    // Filter by source type
    const sourceType = this.selectedSourceType();
    if (sourceType === 'none') {
      filtered = filtered.filter(i => !i.source_type);
    } else if (sourceType) {
      filtered = filtered.filter(i => i.source_type === sourceType);
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(i => {
        const title = this.getItemTitle(i).toLowerCase();
        const desc = (this.getItemDescription(i) || '').toLowerCase();
        // Also check if any child matches
        const children = this.getChildProjects(i.id);
        const childMatch = children.some(c => {
          const cTitle = this.getItemTitle(c).toLowerCase();
          const cDesc = (this.getItemDescription(c) || '').toLowerCase();
          return cTitle.includes(search) || cDesc.includes(search);
        });
        return title.includes(search) || desc.includes(search) || childMatch;
      });
    }

    return filtered;
  }

  /** Get child projects for a parent */
  getChildProjects(parentId: number): Project[] {
    const all = this.items();
    const archived = this.showArchived();
    return all.filter(p =>
      p.parent_project_id === parentId &&
      (archived ? p.is_archived : !p.is_archived)
    );
  }

  /** Toggle expand/collapse of a parent project */
  toggleExpand(projectId: number): void {
    this.expandedParents.update(set => {
      const newSet = new Set(set);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  }

  isExpanded(projectId: number): boolean {
    return this.expandedParents().has(projectId);
  }

  onSearchChange(text: string): void { this.searchText.set(text); }
  onSourceTypeFilterChange(value: string): void { this.selectedSourceType.set(value); }

  toggleShowArchived(): void {
    this.showArchived.update((v) => !v);
  }

  async drop(event: CdkDragDrop<Project[]>): Promise<void> {
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
    try {
      await this.crudService.updatePositions('project', updates);
    } catch (err) {
      this.logger.error('Error updating positions:', err);
      await this.loadItems();
    }
  }

  async togglePin(item: Project): Promise<void> {
    try {
      await this.crudService.togglePin('project', item.id, !item.is_pinned);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error toggling pin:', err);
    }
  }

  async toggleArchive(item: Project): Promise<void> {
    try {
      if (item.is_archived) {
        await this.crudService.unarchive('project', item.id);
      } else {
        await this.crudService.archive('project', item.id);
      }
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error toggling archive:', err);
    }
  }

  confirmDelete(item: Project): void {
    this.itemToDelete = item;
    this.confirmDialog().open();
  }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try {
      await this.crudService.delete('project', this.itemToDelete.id);
      await this.loadItems();
    } catch (err) {
      this.logger.error('Error deleting item:', err);
    } finally {
      this.itemToDelete = null;
    }
  }
}
