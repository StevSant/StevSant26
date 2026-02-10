import { Component, OnInit, signal, viewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '@core/services/supabase.service';
import { TranslateService } from '@core/services/translate.service';
import { Experience, ExperienceTranslation, Image } from '@core/models';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { DashboardFilterComponent, DashboardFilterOption } from '@shared/components/dashboard-filter/dashboard-filter.component';
import { ExperienceItemComponent } from './experience-item/experience-item.component';
import { LoggerService } from '@core/services/logger.service';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, ConfirmDialogComponent, TranslatePipe, DashboardFilterComponent, ExperienceItemComponent],
  templateUrl: './experience-list.component.html',
})
export class ExperienceListComponent implements OnInit {
  private supabase = inject(SupabaseService);
  private translateService = inject(TranslateService);
  private logger = inject(LoggerService);

  confirmDialog = viewChild.required<ConfirmDialogComponent>('confirmDialog');
  loading = signal(true);
  showArchived = signal(false);
  items = signal<Experience[]>([]);
  itemToDelete: Experience | null = null;
  imageMap = new Map<number, string>();

  // Filter state
  searchText = signal('');
  selectedCompany = signal('');
  companyFilterOptions = signal<DashboardFilterOption[]>([]);

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
      this.buildCompanyOptions(data || []);
      await this.loadImages(data || []);
    } catch (err) { this.logger.error('Error loading experiences:', err); }
    finally { this.loading.set(false); }
  }

  /**
   * Build unique company filter options
   */
  private buildCompanyOptions(experiences: Experience[]): void {
    const companies = new Set<string>();
    for (const exp of experiences) {
      if (exp.company) companies.add(exp.company);
    }
    this.companyFilterOptions.set(
      Array.from(companies).sort().map(c => ({ label: c, value: c }))
    );
  }

  /**
   * Get the translated role for an experience
   */
  private async loadImages(items: Experience[]): Promise<void> {
    if (items.length === 0) return;
    const ids = items.map(i => i.id);
    const { data } = await this.supabase
      .from('image')
      .select('*')
      .eq('source_type', 'experience')
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

  getItemRole(item: Experience): string {
    const lang = this.translateService.currentLang();
    const translation = item.translations?.find(t => t.language?.code === lang);
    return translation?.role || item.translations?.[0]?.role || `Experience #${item.id}`;
  }

  filteredItems(): Experience[] {
    const all = this.items();
    let filtered = this.showArchived() ? all.filter((i) => i.is_archived) : all.filter((i) => !i.is_archived);

    // Filter by company
    const company = this.selectedCompany();
    if (company) {
      filtered = filtered.filter(i => i.company === company);
    }

    // Filter by search text
    const search = this.searchText().toLowerCase().trim();
    if (search) {
      filtered = filtered.filter(i => {
        const role = this.getItemRole(i).toLowerCase();
        const comp = (i.company || '').toLowerCase();
        return role.includes(search) || comp.includes(search);
      });
    }

    return filtered;
  }

  onSearchChange(text: string): void { this.searchText.set(text); }
  onCompanyFilterChange(value: string): void { this.selectedCompany.set(value); }

  toggleShowArchived(): void { this.showArchived.update((v) => !v); }

  async drop(event: CdkDragDrop<Experience[]>): Promise<void> {
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
    try { await this.supabase.updatePositions('experience', updates); }
    catch (err) { this.logger.error('Error updating positions:', err); await this.loadItems(); }
  }

  async togglePin(item: Experience): Promise<void> {
    try { await this.supabase.togglePin('experience', item.id, !item.is_pinned); await this.loadItems(); }
    catch (err) { this.logger.error('Error toggling pin:', err); }
  }

  async toggleArchive(item: Experience): Promise<void> {
    try {
      if (item.is_archived) { await this.supabase.unarchive('experience', item.id); }
      else { await this.supabase.archive('experience', item.id); }
      await this.loadItems();
    } catch (err) { this.logger.error('Error toggling archive:', err); }
  }

  confirmDelete(item: Experience): void { this.itemToDelete = item; this.confirmDialog().open(); }

  async deleteItem(): Promise<void> {
    if (!this.itemToDelete) return;
    try { await this.supabase.delete('experience', this.itemToDelete.id); await this.loadItems(); }
    catch (err) { this.logger.error('Error deleting item:', err); }
    finally { this.itemToDelete = null; }
  }
}
